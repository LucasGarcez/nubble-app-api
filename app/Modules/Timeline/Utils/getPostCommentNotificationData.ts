import { capitalizeFirstLetter } from 'App/Shared/Utils/capitalizeFirstLetter'

type GetPostCommentNotificationResponse = {
  title: string
  description: string
}

export const getPostCommentNotificationData = (
  commentCount: number,
  userName: string,
  defaultLanguageRefCode: string
): GetPostCommentNotificationResponse | undefined => {
  const upperCaseName = capitalizeFirstLetter(userName)
  if (commentCount > 1)
    return texts.manyComments(upperCaseName, commentCount - 1)[defaultLanguageRefCode]
  else return texts.singleComment(upperCaseName)[defaultLanguageRefCode]
}

const texts = {
  singleComment: (userName: string) => {
    return {
      portugues_1: {
        title: 'Novo comentário',
        description: `${userName} comentou a sua postagem`,
      },
      ingles_2: {
        title: 'New comment',
        description: `${userName} commented on your post`,
      },
      espanhol_3: {
        title: 'Nuevo comentario',
        description: `${userName} comentó en tu publicación`,
      },
    }
  },
  manyComments: (userName: string, commentCount: number) => {
    return {
      portugues_1: {
        title: 'Novos comentários',
        description: `${userName} e +${commentCount} ${
          commentCount > 1 ? 'pessoas' : 'pessoa'
        } comentaram a sua postagem`,
      },
      ingles_2: {
        title: 'New comments',
        description: `${userName} and +${commentCount} ${
          commentCount > 1 ? 'people' : 'person'
        } commented to your post`,
      },
      espanhol_3: {
        title: 'Nuevos comentarios',
        description: `${userName} y +${commentCount} ${
          commentCount > 1 ? 'personas' : 'persona'
        } comentó en tu publicación`,
      },
    }
  },
}
