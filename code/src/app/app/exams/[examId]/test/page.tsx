import { notFound } from 'next/navigation';
import { findExamById } from '@/lib/loadExams';
import TestClient from './TestClient';

interface TestPageProps {
  params: Promise<{
    examId: string;
  }>;
}

export default async function TestPage({ params }: TestPageProps) {
  const { examId } = await params;
  const exam = findExamById(examId);

  if (!exam) {
    notFound();
  }

  return <TestClient exam={exam} />;
}

