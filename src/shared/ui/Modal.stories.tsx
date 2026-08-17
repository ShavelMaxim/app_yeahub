import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button } from './Button';
import { Modal } from './Modal';

const meta = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    open: true,
    title: 'Подтвердите действие',
    children: 'После подтверждения запись будет удалена.',
    onClose: () => undefined,
    footer: (
      <>
        <Button variant="ghost">Отмена</Button>
        <Button variant="danger">Удалить</Button>
      </>
    ),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
export const WithoutFooter: Story = { args: { footer: undefined } };
