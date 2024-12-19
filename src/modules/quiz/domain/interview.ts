export class Interview {
  id: number;
  subCategory: {
    id: number;
    name: string;
    main_category: string;
  };
  question: string;
  answer: string;
  keywords: string[];
  createdAt: Date;
  likes?: { userId: number }[];
}
