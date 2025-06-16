export type ViewMode = 'grid' | 'list';

export type Theme = 'light' | 'dark';

export interface BreadcrumbItem {
  id?: number;
  name: string;
  path?: string;
  href?: string;
}

export interface ContextMenuItem {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  disabled?: boolean;
  separator?: boolean;
}

// Common component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'success'
    | 'warning'
    | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  iconPosition?: 'left' | 'right';
  title?: string;
}
