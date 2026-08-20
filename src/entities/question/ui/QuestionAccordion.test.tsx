import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { QuestionAccordion } from './QuestionAccordion';

const question = {
  id: 42,
  title: 'Что такое замыкание?',
  shortAnswer: 'Функция вместе с лексическим окружением.',
};

const TestAccordion = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <QuestionAccordion question={question} isOpen={isOpen} onToggle={() => setOpen(!isOpen)} />
  );
};

describe('QuestionAccordion', () => {
  it('opens the catalog card and exposes a details route', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <TestAccordion />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: question.title }));

    expect(screen.getByText(question.shortAnswer)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Подробнее/ })).toHaveAttribute(
      'href',
      '/questions/42',
    );
  });
});
