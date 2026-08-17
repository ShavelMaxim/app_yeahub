import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button } from './Button';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: 'Ничего не найдено',
    description: 'Измените параметры поиска и попробуйте ещё раз.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithAction: Story = {
  args: { action: <Button variant="secondary">Сбросить фильтры</Button> },
};
