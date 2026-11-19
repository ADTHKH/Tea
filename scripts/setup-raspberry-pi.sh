#!/bin/bash
# 樹莓派一次性設定：讓展示網頁直接用 USB 收據機列印，不跳任何詢問或列印視窗。
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

echo "完成：已允許 $ORIGIN 使用收據機。"
echo "請把收據機 USB 拔掉再插回去，然後關掉 Chromium 重開。"
