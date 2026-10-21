"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { ApiClientError } from "@/lib/api-error";
import { changePassword, getProfile, updateProfile } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import type { Profile } from "@/types/auth";

export default function ProfilePage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const profileQuery = useQuery({
    queryKey: ["account", "profile"],
    queryFn: () => {
      if (!accessToken) throw new Error("Bạn cần đăng nhập để xem hồ sơ.");
      return getProfile(accessToken);
    },
    enabled: Boolean(accessToken),
  });

  if (!accessToken) {
    return (
      <main className="flex flex-1 items-center justify-center px-5 py-16">
        <section className="max-w-md rounded-3xl border border-stone-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-black text-stone-900">Bạn chưa đăng nhập</h1>
          <p className="mt-2 text-sm text-stone-500">Đăng nhập để xem và cập nhật hồ sơ.</p>
          <Link href="/login" className="mt-5 inline-flex rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-white hover:bg-orange-700">
            Đăng nhập
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700">Tài khoản</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">Hồ sơ của tôi</h1>
      {profileQuery.isPending && <p className="mt-8 text-sm text-stone-500">Đang tải hồ sơ...</p>}
      {profileQuery.isError && (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {profileQuery.error.message || "Không thể tải hồ sơ."}
        </p>
      )}
      {profileQuery.data && (
        <ProfileForms
          profile={profileQuery.data.data}
          accessToken={accessToken}
        />
      )}
    </main>
  );
}

function ProfileForms({
  profile,
  accessToken,
}: {
  profile: Profile;
  accessToken: string;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileError("");
    setIsSavingProfile(true);
    try {
      const { data } = await updateProfile(
        {
          displayName: displayName.trim(),
          bio: bio.trim(),
          avatarUrl: avatarUrl.trim() || null,
        },
        accessToken,
      );
      queryClient.setQueryData(["account", "profile"], { data });
      setUser({
        id: data.id,
        email: data.email,
        displayName: data.displayName,
        role: data.role,
      });
    } catch (caughtError) {
      setProfileError(
        caughtError instanceof ApiClientError
          ? caughtError.message
          : "Không thể cập nhật hồ sơ.",
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");
    setIsSavingPassword(true);
    try {
      const result = await changePassword(
        { currentPassword, newPassword },
        accessToken,
      );
      setPasswordMessage(result.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (caughtError) {
      setPasswordError(
        caughtError instanceof ApiClientError
          ? caughtError.message
          : "Không thể đổi mật khẩu.",
      );
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2">
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-extrabold text-stone-900">Thông tin cá nhân</h2>
        <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-stone-700">Email</span>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-stone-700">Tên hiển thị</span>
            <input
              type="text"
              required
              maxLength={100}
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-stone-700">Giới thiệu</span>
            <textarea
              maxLength={500}
              rows={4}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-stone-700">Ảnh đại diện (URL)</span>
            <input
              type="url"
              maxLength={500}
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
            />
          </label>
          {profileError && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
              {profileError}
            </p>
          )}
          <button
            type="submit"
            disabled={isSavingProfile}
            className="w-full rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60"
          >
            {isSavingProfile ? "Đang lưu..." : "Lưu hồ sơ"}
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-extrabold text-stone-900">Đổi mật khẩu</h2>
        <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-stone-700">Mật khẩu hiện tại</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-stone-700">Mật khẩu mới</span>
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
            />
          </label>
          {passwordError && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
              {passwordError}
            </p>
          )}
          {passwordMessage && (
            <p role="status" className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
              {passwordMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={isSavingPassword}
            className="w-full rounded-xl border border-orange-200 px-5 py-3 text-sm font-bold text-orange-800 hover:bg-orange-50 disabled:opacity-60"
          >
            {isSavingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
          </button>
        </form>
      </section>
    </div>
  );
}
