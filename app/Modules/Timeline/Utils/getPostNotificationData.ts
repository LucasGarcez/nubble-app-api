type GetPostNotificationResponse = {
  title: string
  description: string
}

export const getPostNotificationData = (
  defaultLanguageRefCode: string
): GetPostNotificationResponse | undefined => {
  return texts[defaultLanguageRefCode]
}

const texts = {
  portugues_1: {
    title: 'Nova postagem',
    description: 'Nova postagem disponível',
  },
  ingles_2: {
    title: 'New post',
    description: 'New post available',
  },
  espanhol_3: {
    title: 'Nueva publicación',
    description: 'Nueva publicación disponible',
  },
}
