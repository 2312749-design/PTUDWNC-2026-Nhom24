'use client'

import { useState } from 'react'

/**
 * Avatar dùng chung cho khu vực cộng đồng, hồ sơ và thanh điều hướng.
 * Component vẫn hiển thị chữ cái đầu khi tài khoản chưa có ảnh đại diện.
 */
export default function Avatar({ user, size = 'normal' }) {
  const [failedUrl, setFailedUrl] = useState(null)
  const username = user?.username || user?.userName || ''
  const displayName = user?.fullName || user?.displayName || username || '?'
  const initials = displayName.slice(0, 1).toUpperCase()

  return user?.avatarUrl && user.avatarUrl !== failedUrl
    ? <img className={`community-avatar ${size}`} src={user.avatarUrl} alt={displayName} onError={() => setFailedUrl(user.avatarUrl)} />
    : <span className={`community-avatar avatar-fallback ${size}`} role="img" aria-label={displayName}>{initials}</span>
}
