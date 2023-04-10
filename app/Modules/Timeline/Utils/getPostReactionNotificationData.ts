import { capitalizeFirstLetter } from 'App/Shared/Utils/capitalizeFirstLetter'

type GetPostReactionNotificationResponse = {
  title: string
  description: string
}

export const getPostReactionNotificationData = (
  reactionCount: number,
  userName: string,
  defaultLanguageRefCode: string
): GetPostReactionNotificationResponse | undefined => {
  const upperCaseName = capitalizeFirstLetter(userName)
  if (reactionCount > 1)
    return texts.manyReactions(upperCaseName, reactionCount - 1)[defaultLanguageRefCode]
  else return texts.singleReaction(upperCaseName)[defaultLanguageRefCode]
}

const texts = {
  singleReaction: (userName: string) => {
    return {
      portugues_1: {
        title: 'Primeira reação',
        description: `${userName} reagiu a sua postagem`,
      },
      ingles_2: {
        title: 'First reaction',
        description: `${userName} reacted to your post`,
      },
      espanhol_3: {
        title: 'Primera reacción',
        description: `${userName} reaccionó a tu publicación`,
      },
    }
  },
  manyReactions: (userName: string, reactionCount: number) => {
    return {
      portugues_1: {
        title: 'Novas reações',
        description: `${userName} e +${reactionCount} reagiram a sua postagem`,
      },
      ingles_2: {
        title: 'New reactions',
        description: `${userName} and +${reactionCount} reacted to your post`,
      },
      espanhol_3: {
        title: 'Nuevas reacciones',
        description: `${userName} y +${reactionCount} reaccionó a tu publicación`,
      },
    }
  },
}
