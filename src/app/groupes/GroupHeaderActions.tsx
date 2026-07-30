"use client";

import { useState } from "react";
import EditGroupModal from "@/components/groups/EditGroupModal";

interface GroupHeaderActionsProps {
  group: any;
  isOwner: boolean;
}

export default function GroupHeaderActions({ group, isOwner }: GroupHeaderActionsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!isOwner) return null;

  return (
    <>
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 transition font-medium text-sm backdrop-blur-md"
      >
        ✏️ Modifier le groupe
      </button>

      <EditGroupModal
        group={group}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}