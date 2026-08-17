import type { Meta, StoryObj } from '@storybook/react';
import { Typography, type TypographyVariant } from './Typography';

const variants: TypographyVariant[] = [
  'headline1',
  'headline2',
  'headline3',
  'headline4',
  'headline5',
  'body1',
  'body1Accent',
  'body2',
  'body2Accent',
  'body2Strong',
  'body3',
  'body3Accent',
  'body3Strong',
  'body4',
  'body5',
  'body5Accent',
  'body5Caption',
  'body5Strong',
  'body6',
];

const meta = {
  title: 'Shared/Typography',
  component: Typography,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  args: {
    children: 'YeaHub typography',
  },
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {variants.map((variant) => (
        <Typography key={variant} variant={variant}>
          {variant} — YeaHub typography
        </Typography>
      ))}
    </div>
  ),
};
