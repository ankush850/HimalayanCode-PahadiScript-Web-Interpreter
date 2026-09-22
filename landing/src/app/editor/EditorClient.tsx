"use client";

import dynamic from 'next/dynamic';

const EditorPage = dynamic(() => import('../../views/EditorPage'), { ssr: false });

export default function EditorClient() {
  return <EditorPage />;
}
