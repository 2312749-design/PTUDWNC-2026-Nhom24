'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Title, Description } from '@radix-ui/react-dialog'
import { Dialog, DialogContent } from '../ui/Dialog'
import { useCosmicPreferences } from './cosmic-preferences'

function randomIndex(length) {
  if (globalThis.crypto?.getRandomValues) return crypto.getRandomValues(new Uint32Array(1))[0] % length
  return Math.floor(Math.random() * length)
}

export default function FoodRoulette({ recipes, onScanningChange, fallbackImage }) {
  const { effectsEnabled, playSfx } = useCosmicPreferences()
  const candidates = useMemo(() => recipes.filter(recipe => recipe.id && (recipe.status == null || recipe.status === 1 || String(recipe.status).toLowerCase() === 'published')), [recipes])
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState('idle')
  const [previewIndex, setPreviewIndex] = useState(0)
  const [winner, setWinner] = useState(null)
  const preview = stage === 'winner' ? winner : candidates[previewIndex % Math.max(1, candidates.length)]

  useEffect(() => {
    if (!open || stage !== 'spinning' || !candidates.length) return
    const selected = candidates[randomIndex(candidates.length)]
    let tick = 0
    const interval = window.setInterval(() => {
      tick += 1
      setPreviewIndex((tick * 7) % candidates.length)
      playSfx('roulette')
    }, 110)
    const timer = window.setTimeout(() => {
      window.clearInterval(interval)
      setWinner(selected)
      setStage('winner')
      onScanningChange(false)
      playSfx('jackpot')
    }, effectsEnabled ? 2300 : 350)
    return () => { window.clearInterval(interval); window.clearTimeout(timer); onScanningChange(false) }
  }, [open, stage, candidates, effectsEnabled, playSfx, onScanningChange])

  const start = () => {
    if (!candidates.length) return
    setPreviewIndex(randomIndex(candidates.length))
    setWinner(null)
    setStage('spinning')
    setOpen(true)
    onScanningChange(true)
  }
  const changeOpen = (nextOpen) => {
    setOpen(nextOpen)
    if (!nextOpen) { setStage('idle'); onScanningChange(false) }
  }

  return <>
    <button type="button" className="cosmic-roulette-button" onClick={start} disabled={!candidates.length} data-cosmic-sfx="power"><span aria-hidden="true">🎲</span> Hôm nay ăn gì?</button>
    <Dialog open={open} onOpenChange={changeOpen}><DialogContent className={`cosmic-roulette-dialog ${stage === 'spinning' ? 'is-spinning' : 'is-winner'}`}>
      <p className="cosmic-roulette-kicker">CYBER FOOD ROULETTE</p>
      <Title>{stage === 'spinning' ? 'Đang quét thực đơn…' : 'Món ngon dành cho bạn'}</Title>
      <Description>{stage === 'spinning' ? 'Bếp Nhà đang chọn từ các công thức công khai hiện có.' : 'Gợi ý ngẫu nhiên từ cộng đồng. Mở công thức để xem cách nấu chi tiết.'}</Description>
      {preview && <article className="roulette-preview"><img src={preview.imageUrl || fallbackImage} alt={preview.title} /><div><small>{preview.categoryName}</small><h3>{preview.title}</h3><p>{[preview.cookingTimeMinutes ? `${preview.cookingTimeMinutes} phút` : '', preview.difficulty].filter(Boolean).join(' · ')}</p></div>{stage === 'spinning' && <span className="roulette-scan" aria-hidden="true" />}</article>}
      <div className="roulette-winner" role="status" aria-live="polite">{stage === 'winner' ? `Đã chọn: ${winner?.title || ''}` : 'Đang quay…'}</div>
      {stage === 'winner' && winner && <div className="roulette-actions"><button type="button" onClick={start}>Quay lại</button><Link href={`/recipes/${winner.id}`} onClick={() => changeOpen(false)}>Xem công thức →</Link></div>}
    </DialogContent></Dialog>
  </>
}
