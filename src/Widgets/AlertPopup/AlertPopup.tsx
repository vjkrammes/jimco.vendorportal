import { Alert, AlertColor } from '@mui/material';
import { useAlert } from '../../Contexts/AlertContext';

function getSeverity(sev: string): AlertColor {
  switch (sev.toLowerCase()) {
    case 'success':
      return 'success';
    case 'info':
      return 'info';
    case 'warning':
      return 'warning';
    default:
      return 'error';
  }
}

export default function AlertPopup() {
  const { text, type } = useAlert();
  if (text && type) {
    return (
      <Alert
        severity={getSeverity(type)}
        sx={{
          position: 'absolute',
          alignItems: 'center',
          right: '10px',
          top: '10px',
          backgroundColor: 'hsl(44.06 100% 74.9%)',
          color: 'hsl(42.35 100% 6.67%)',
          fontSize: '1.25rem',
          lineHeight: '2rem',
          boxShadow: '3px 5px 5px hsl(34.39 75.85% 40.59%)',
        }}
      >
        {text}
      </Alert>
    );
  } else {
    return <></>;
  }
}
