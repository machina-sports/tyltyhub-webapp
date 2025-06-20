"use client"

import { Metadata } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useGlobalState } from "@/store/useState"

interface ChatMetadataProps {
  threadId: string
}

export function ChatMetadata({ threadId }: ChatMetadataProps) {
  const state = useGlobalState((state: any) => state.threads)
  const [title, setTitle] = useState('SportingBOT Chat')
  const [description, setDescription] = useState('Veja esta conversa no Sportingbet CWC')
  
  useEffect(() => {
    if (state.item.data?.value?.messages?.length > 0) {
      const firstMessage = state.item.data.value.messages[0].content || ''
      setTitle(firstMessage.substring(0, 60) + (firstMessage.length > 60 ? '...' : '') + ' | Sportingbet CWC')
      
      const assistantMessage = state.item.data.value.messages.find((msg: any) => msg.role === 'assistant')
      if (assistantMessage) {
        const content = typeof assistantMessage.content === 'string' 
          ? assistantMessage.content 
          : assistantMessage.content?.question_answer || ''
        
        setDescription(content.substring(0, 150) + (content.length > 150 ? '...' : ''))
      }
    }
  }, [state.item.data])

  const shareImageUrl = `https://sportingbot.com/og_image_4.png`

  return (
    <Head>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://sportingbot.com/chat/${threadId}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={shareImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="SportingBOT: a IA da Sportingbet" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="SportingBOT" />
      <meta property="og:logo" content="https://sportingbot.com/og_image_4.png" />
      
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`https://sportingbot.com/chat/${threadId}`} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={shareImageUrl} />
    </Head>
  )
}
