'use client'

import { useMemo, useState } from 'react'
import { useMusicPlayer } from './music-player-context'

/**
 * Nằm trong AppHeader (thuộc Root Layout) nên không bị unmount khi đổi route.
 * Trình duyệt không cho tự phát nhạc có tiếng; người dùng phải bấm phát lần đầu.
 */
export default function SiteMusicPlayer() {
  const { track, tracks, isPlaying, volume, togglePlayback, setVolume, selectTrack } = useMusicPlayer()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const matchingTracks = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase('vi-VN')
    return keyword ? tracks.filter((item) => `${item.title} ${item.artists}`.toLocaleLowerCase('vi-VN').includes(keyword)) : tracks
  }, [query, tracks])

  return (
    <div className={`site-music${isOpen ? ' is-open' : ''}`}>
      <button
        className="site-music__toggle"
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label="Mở danh sách nhạc"
        title="Chọn bài hát"
      >
        <span aria-hidden="true">{isPlaying ? '♫' : '♪'}</span>
        <span className="site-music__label">Chọn nhạc</span>
      </button>
      {isOpen && <section className="site-music__panel" aria-label="Chọn bài hát">
        <p className="site-music__eyebrow">CHỌN BÀI HÁT</p>
        <label className="site-music__search"><span>Tìm bài hát</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tên bài hát hoặc nghệ sĩ…" autoFocus /></label>
        <div className="site-music__track-list">
          {matchingTracks.map((item) => <button key={item.id} type="button" className={item.id === track.id ? 'is-selected' : ''} onClick={() => selectTrack(item.id)}>
            <img src={item.cover} alt="" /><span><b>{item.title}</b><small>{item.artists}</small></span>{item.id === track.id && <em>Đang chọn</em>}
          </button>)}
          {!matchingTracks.length && <p>Không tìm thấy bài phù hợp.</p>}
        </div>
        <strong className="site-music__current">Đang chọn: {track.title}</strong>
        <div className="site-music__controls">
          <button type="button" className="site-music__play" onClick={togglePlayback}>
            {isPlaying ? '❚❚ Tạm dừng' : '▶ Phát nhạc'}
          </button>
          <label>
            <span>Âm lượng</span>
            <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(event.target.value)} aria-label="Âm lượng nhạc" />
          </label>
        </div>
        <p className="site-music__hint">Nhạc tiếp tục phát khi bạn chuyển trang trong website.</p>
      </section>}
    </div>
  )
}
