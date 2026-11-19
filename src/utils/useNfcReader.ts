import { useEffect, useRef, useState } from 'react';
import { TeaProduct, EmotionOption } from '../types/tea';
import { matchNfcToTea, matchNfcToEmotion } from './nfcMatcher';
import { sounds } from './audio';

export type NfcScanMode = 'tea' | 'emotion' | 'none';

interface UseNfcReaderOptions {
  mode: NfcScanMode;
  onScanTea: (tea: TeaProduct, chipUid: string) => void;
  onScanEmotion?: (emotion: EmotionOption, chipUid: string) => void;
  onInvalidScan?: (scannedUid: string) => void;
  emotionChipMap?: Record<string, string>;
}

export function useNfcReader({
  mode,
  onScanTea,
  onScanEmotion,
  onInvalidScan,
  emotionChipMap
}: UseNfcReaderOptions) {
  const [lastScannedUid, setLastScannedUid] = useState<string | null>(null);
  const [lastScannedTeaName, setLastScannedTeaName] = useState<string | null>(null);
  const bufferRef = useRef<string>('');
  const timeoutRef = useRef<number | null>(null);
  const lastMatchedAtRef = useRef<number>(0);
  const lastCharAtRef = useRef<number>(0);

  // Keep latest callbacks in refs so keyboard/NFC listeners never tear down on re-render
  const modeRef = useRef<NfcScanMode>(mode);
  const onScanTeaRef = useRef(onScanTea);
  const onScanEmotionRef = useRef(onScanEmotion);
  const onInvalidScanRef = useRef(onInvalidScan);
  const emotionChipMapRef = useRef(emotionChipMap);

  modeRef.current = mode;
  onScanTeaRef.current = onScanTea;
  onScanEmotionRef.current = onScanEmotion;
  onInvalidScanRef.current = onInvalidScan;
  emotionChipMapRef.current = emotionChipMap;

  useEffect(() => {
    // In steam, reveal, printer, or modal editing modes -> completely ignore all NFC chips
    if (mode === 'none') {
      bufferRef.current = '';
      lastMatchedAtRef.current = 0;
      lastCharAtRef.current = 0;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    const evaluateScan = (raw: string, allowPartial: boolean): boolean => {
      const currentMode = modeRef.current;
      if (currentMode === 'none') return true;

      const teaMatch = matchNfcToTea(raw);
      const emotionMatch = matchNfcToEmotion(raw, emotionChipMapRef.current);

      if (currentMode === 'tea') {
        if (teaMatch) {
          sounds.playCupPlace();
          setLastScannedUid(teaMatch.matchedUid);
          setLastScannedTeaName(teaMatch.tea.name);
          onScanTeaRef.current(teaMatch.tea, teaMatch.matchedUid);
          return true;
        }
        // In tea/home stage, scanning any of the 6 emotion chips OR any unknown chip triggers alert modal
        if (emotionMatch || !allowPartial) {
          sounds.playWrongCup();
          onInvalidScanRef.current?.(raw);
          return true;
        }
        return false;
      }

      if (currentMode === 'emotion') {
        if (emotionMatch) {
          sounds.playConfirmChime();
          setLastScannedUid(emotionMatch.matchedUid);
          setLastScannedTeaName(emotionMatch.emotion.label);
          onScanEmotionRef.current?.(emotionMatch.emotion, emotionMatch.matchedUid);
          return true;
        }
        // In emotion stage, scanning any of the 6 tea chips OR any unknown chip triggers alert modal
        if (teaMatch || !allowPartial) {
          sounds.playWrongCup();
          onInvalidScanRef.current?.(raw);
          return true;
        }
        return false;
      }

      return false;
    };

    // 1. USB Keyboard Wedge NFC Reader Listener (capture phase so trailing Enter never triggers page Enter shortcuts)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing inside an input or textarea (e.g. in settings modal)
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      // If Enter or Tab is received from USB NFC reader, process buffer or swallow trailing Enter after immediate match
      if (e.key === 'Enter' || e.key === 'Tab') {
        const raw = bufferRef.current.trim();
        bufferRef.current = '';
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (raw.length > 0) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          evaluateScan(raw, false);
          lastMatchedAtRef.current = 0;
          lastCharAtRef.current = 0;
        } else if (
          Date.now() - lastMatchedAtRef.current < 500 ||
          Date.now() - lastCharAtRef.current < 150
        ) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          lastMatchedAtRef.current = 0;
          lastCharAtRef.current = 0;
        }
        return;
      }

      // Collect alphanumeric characters from RFID/NFC wedge
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        lastCharAtRef.current = Date.now();
        bufferRef.current += e.key;

        // Reset timer to flush stale keystrokes after 600ms
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
          const currentBuffer = bufferRef.current.trim();
          bufferRef.current = '';
          if (currentBuffer.length >= 6) {
            evaluateScan(currentBuffer, false);
          }
        }, 600);

        // Immediately match as soon as complete chip UID is in buffer
        if (evaluateScan(bufferRef.current, true)) {
          bufferRef.current = '';
          lastMatchedAtRef.current = Date.now();
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);

    // 2. Web NFC API Listener (for Chrome on Android / NFC enabled devices)
    let ndefController: AbortController | null = null;
    if ('NDEFReader' in window) {
      try {
        const ndef = new (window as any).NDEFReader();
        ndefController = new AbortController();
        ndef.scan({ signal: ndefController.signal })
          .then(() => {
            ndef.addEventListener('reading', (event: any) => {
              const serial = event.serialNumber || '';
              if (serial) {
                evaluateScan(serial, false);
              }
            });
          })
          .catch((err: any) => {
            console.log('Web NFC background scan unavailable:', err);
          });
      } catch (err) {
        console.log('Web NFC not initialized:', err);
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (ndefController) ndefController.abort();
    };
  }, [mode]);

  return {
    lastScannedUid,
    lastScannedTeaName,
    clearLastScanned: () => {
      setLastScannedUid(null);
      setLastScannedTeaName(null);
    }
  };
}
