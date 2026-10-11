// Les commentaires se modifient dans newsComments.json (même dossier).
import data from './newsComments.json';

export interface NewsComment {
  link: string;
  date: string;
  source: string;
  title: { fr: string; en: string };
  image?: string;
  comment: { fr: string; en: string };
}

export const NEWS_COMMENTS: NewsComment[] = data.commentaires;
