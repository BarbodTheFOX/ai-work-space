"use client";

import { useOps } from "@/app/providers";

export function UserSwitcherMock() {
  const { currentUser, users, setCurrentUserId } = useOps();

  return (
    <label className="block">
      <span className="mb-2 block text-[11px] text-eventum-dim">Mock user</span>
      <select
        value={currentUser.id}
        onChange={(event) => setCurrentUserId(event.target.value)}
        className="w-full rounded border border-eventum-border bg-eventum-elevated px-2.5 py-1.5 text-sm text-eventum-text outline-none focus:border-eventum-borderStrong"
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} - {user.role}
          </option>
        ))}
      </select>
    </label>
  );
}
