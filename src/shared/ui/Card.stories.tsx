import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Card } from './Card';

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    children: 'Карточка с содержимым',
    style: { maxWidth: 420 },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Interactive: Story = { args: { interactive: true } };
