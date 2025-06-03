"use client"

import type React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Function to generate a consistent color based on name
const getColorFromName = (name: string): string => {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
  ]

  // Generate a hash from the name
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Use the hash to pick a color
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

// Function to get initials from name
const getInitials = (name: string): string => {
  if (!name) return "?"

  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// Animal/creature emoji mapping
const creatures = [
  "🐉",
  "🦄",
  "🦊",
  "🐺",
  "🦁",
  "🐯",
  "🐻",
  "🐨",
  "🐼",
  "🦓",
  "🦒",
  "🐘",
  "🦔",
  "🐿️",
  "🦇",
  "🦅",
  "🦉",
  "🦜",
  "🐦",
  "🐧",
  "🐢",
  "🐙",
  "🦑",
  "🦞",
  "🦀",
  "🐠",
  "🐬",
  "🐳",
  "🦈",
  "🐊",
  "🐸",
  "🦎",
  "🐍",
  "🐌",
  "🦋",
  "🐝",
  "🐞",
  "🦂",
  "🕷️",
  "🦖",
  "🦕",
  "🐲",
  "🧚",
  "🧙",
  "🧛",
  "🧜",
  "🧝",
  "👽",
  "🤖",
  "👻",
  "🦝",
  "🦡",
  "🦘",
  "🦚",
  "🦩",
  "🦥",
  "🦦",
  "🦨",
  "🦮",
  "🐕",
  "🐩",
  "🐈",
  "🦌",
  "🦙",
  "🦏",
  "🐪",
  "🐫",
  "🦒",
  "🐃",
  "🐂",
  "🐄",
  "🐎",
]

// Function to get a consistent creature based on name
const getCreatureFromName = (name: string): string => {
  if (!name) return creatures[0]

  // Generate a hash from the name
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Use the hash to pick a creature
  const index = Math.abs(hash) % creatures.length
  return creatures[index]
}

interface StudentAvatarProps {
  name: string
  size?: "sm" | "md" | "lg"
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({ name, size = "md" }) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-lg",
  }

  const creature = getCreatureFromName(name)
  const bgColor = getColorFromName(name)

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarFallback className={`${bgColor} text-white`} title={`${name} (${creature})`}>
        {creature}
      </AvatarFallback>
    </Avatar>
  )
}
