'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/context/LanguageContext';

const authors = {
  nabil: {
    name: 'Mr. Nabil Hamdoun',
    role: 'Global Financial Markets Analyst',
    avatar: '/NABIL.jpg',
    fallback: 'NH'
  },
  amine: {
    name: 'Mr. El Amine',
    role: 'Expert Market Analyst & Developer',
    avatar: '/amine.jpeg',
    fallback: 'EA'
  },
  josef: {
    name: 'Mr. Josef Mamulashvili',
    role: 'Global Market Analyst & Finance Specialist',
    avatar: '/youssef.jpeg',
    fallback: 'JM'
  },
  hajar: {
    name: 'Ms. Hajar',
    role: 'Senior Market Strategist & Financial Researcher',
    avatar: '/hajar.png',
    fallback: 'H'
  }
};

interface AuthorBylineProps {
  authorId: keyof typeof authors;
}

export function AuthorByline({ authorId }: AuthorBylineProps) {
  const { lang } = useLanguage();
  const author = authors[authorId];

  return (
    <div className="flex items-center gap-4 py-6 border-b border-border/10 mb-8">
      <Avatar className="h-12 w-12 border border-primary/20">
        <AvatarImage src={author.avatar} alt={author.name} />
        <AvatarFallback>{author.fallback}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-semibold text-foreground">
          {lang === 'ar' ? 'بقلم: ' : 'By '} {author.name}
        </p>
        <p className="text-xs text-muted-foreground">{author.role}</p>
      </div>
    </div>
  );
}
