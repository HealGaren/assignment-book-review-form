import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>독서 기록</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container>
        <Title>독서 기록</Title>
        <Description>읽은 책의 감상과 인용구를 기록해 보세요.</Description>
        <StartButton onClick={() => router.push('/steps/book-info')}>시작하기</StartButton>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StartButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 1.125rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
