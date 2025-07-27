import React from 'react';
import GradientForm from '@/components/GradientForm';
import loadIconData from '@/utils/parseData';

export default function Home() {
  const categories = loadIconData();
  return <GradientForm categories={categories} />;
}
