import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Pagination } from './Pagination';

const meta = {
  title: 'UI/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    currentPage: 4,
    totalPages: 12,
    onPageChange: () => undefined,
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FirstPage: Story = { args: { currentPage: 1 } };
export const LastPage: Story = { args: { currentPage: 12 } };
