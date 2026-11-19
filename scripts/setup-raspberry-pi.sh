#!/bin/bash
# 樹莓派一次性設定：開機自動全螢幕打開展示網頁，並讓網頁直接用 USB 收據機列印，不跳任何詢問或列印視窗。
# 換一台樹莓派才需要重跑；網站更新、重新發布都不用。
#
# 用法（在樹莓派的終端機）：
#   curl -fsSL https://raw.githubusercontent.com/ADTHKH/Tea/main/scripts/setup-raspberry-pi.sh | sudo bash -s https://你的發布網址
set -e

URL="${1:?請在最後面加上 AI Studio 發布後的網址，例如 https://xxxx.run.app}"
ORIGIN=$(echo "$URL" | sed -E 's#^(https?://[^/]+).*#\1#')

# 1. 讓瀏覽器有權限直接使用這台收據機（Xprinter XP-Q90EC）
echo 'SUBSYSTEM=="usb", ATTR{idVendor}=="0483", ATTR{idProduct}=="070b", MODE="0666"' \
  > /etc/udev/rules.d/99-tea-receipt-printer.rules

# 2. 不讓系統內建的印表機驅動先把收據機搶走
echo 'blacklist usblp' > /etc/modprobe.d/tea-no-usblp.conf
rmmod usblp 2>/dev/null || true
udevadm control --reload-rules
udevadm trigger

# 3. 預先允許這個網址使用收據機，列印時不會跳出「要不要允許」的視窗
mkdir -p /etc/chromium/policies/managed
cat > /etc/chromium/policies/managed/tea-kiosk.json <<EOF
{
  "WebUsbAllowDevicesForUrls": [
    { "devices": [{ "vendor_id": 1155, "product_id": 1803 }], "urls": ["$ORIGIN"] }
  ]
}
EOF

# 4. 開機自動登入桌面，並用全螢幕打開展示網址（沒有網址列；要離開按 Alt+F4）
KIOSK_USER="${SUDO_USER:-$(logname 2>/dev/null || echo pi)}"
KIOSK_HOME=$(getent passwd "$KIOSK_USER" | cut -d: -f6)
BROWSER=$(command -v chromium-browser || command -v chromium || true)
if [ -z "$BROWSER" ]; then
  echo "找不到 Chromium 瀏覽器，請先執行：sudo apt install chromium" >&2
  exit 1
fi
raspi-config nonint do_boot_behaviour B4 2>/dev/null || true
mkdir -p "$KIOSK_HOME/.config/autostart"
cat > "$KIOSK_HOME/.config/autostart/tea-kiosk.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=茶靈絮語展示
Exec=$BROWSER --kiosk --noerrdialogs --disable-infobars --no-first-run --hide-crash-restore-bubble --password-store=basic --autoplay-policy=no-user-gesture-required $ORIGIN/
X-GNOME-Autostart-enabled=true
EOF
chown -R "$KIOSK_USER": "$KIOSK_HOME/.config/autostart"

# 5. 關掉螢幕閒置自動變黑
raspi-config nonint do_blanking 1 2>/dev/null || true

echo "完成：開機會自動全螢幕打開 $ORIGIN/，並允許它使用收據機。"
echo "請把收據機 USB 拔掉再插回去，然後重新開機：sudo reboot"
