'use client'

import { useCosmicPreferences } from './cosmic-preferences'

export default function CosmicControls() {
  const { soundEnabled, effectsEnabled, spiderEnabled, sfxVolume, boost, palette, toggleSound, toggleEffects, toggleSpider, setSfxVolume, toggleBoost, setPalette } = useCosmicPreferences()
  return <div className="cosmic-controls" role="group" aria-label="Tùy chỉnh trải nghiệm">
    <button type="button" role="switch" className="cosmic-toggle cosmic-toggle--sound" aria-label="Âm thanh" aria-checked={soundEnabled} onClick={toggleSound} data-cosmic-sound-control="true" title="Bật hoặc tắt âm thanh tương tác giao diện">
      <span aria-hidden="true">{soundEnabled ? '🔊' : '🔇'}</span> Âm thanh: <b>{soundEnabled ? 'ON' : 'OFF'}</b><i aria-hidden="true" />
    </button>
    <label className="cosmic-sfx-level" data-cosmic-sound-control="true"><span>Độ lớn SFX</span><input type="range" min="0" max="100" step="5" value={Math.round(sfxVolume * 100)} onChange={event => setSfxVolume(Number(event.target.value) / 100)} aria-label="Độ lớn SFX" /><output>{Math.round(sfxVolume * 100)}%</output></label>
    <button type="button" className="cosmic-boost" aria-label="Boost SFX" aria-pressed={boost} onClick={toggleBoost} data-cosmic-sfx="power">Boost</button>
    <button type="button" role="switch" className="cosmic-toggle cosmic-toggle--effects" aria-label="Hiệu ứng 3D" aria-checked={effectsEnabled} onClick={toggleEffects} data-cosmic-sfx="power" title="Bật hoặc tắt hạt ánh sáng, sóng xung kích và hiệu ứng nghiêng 3D">
      <span aria-hidden="true">✨</span> Hiệu ứng 3D: <b>{effectsEnabled ? 'ON' : 'OFF'}</b><i aria-hidden="true" />
    </button>
    <button type="button" role="switch" className="cosmic-toggle cosmic-toggle--spider" aria-label="Nhện AI" aria-checked={spiderEnabled} onClick={toggleSpider} data-cosmic-sfx="power" title={effectsEnabled ? 'Bật hoặc tắt bạn đồng hành nhện neon' : 'Nhện sẽ xuất hiện khi Hiệu ứng 3D được bật'}><span aria-hidden="true">🕷️</span> Nhện AI: <b>{spiderEnabled ? 'ON' : 'OFF'}</b></button>
    <label className="cosmic-theme-select"><span className="cosmic-sr-only">Tông màu vũ trụ</span><select aria-label="Tông màu vũ trụ" value={palette} onChange={event => setPalette(event.target.value)}><option value="cyan">Cyan Nebula</option><option value="purple">Purple Synthwave</option><option value="emerald">Emerald Matrix</option></select></label>
  </div>
}
