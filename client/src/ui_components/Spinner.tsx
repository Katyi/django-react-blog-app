import type { CSSProperties } from 'react';
import { ClipLoader } from 'react-spinners';

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'purple',
};

const Spinner = () => {
  return (
    <ClipLoader
      cssOverride={override}
      size={450}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Spinner;
