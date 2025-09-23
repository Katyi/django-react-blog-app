import React, { useState, useRef, useEffect } from 'react';

interface CustomFileInputProps {
  label?: string;
  onChange: (...event: unknown[]) => void;
  onBlur?: () => void;
  // name?: string;
  value?: string | File | null;
}

const CustomFileInput: React.FC<CustomFileInputProps> = ({
  label,
  onChange,
  onBlur,
  // name,
  value,
}) => {
  const [fileName, setFileName] = useState('Файл не выбран');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      if (value instanceof File) {
        setFileName(value.name);
      } else if (typeof value === 'string') {
        const parts = value.split('/');
        setFileName(parts[parts.length - 1]);
      }
    } else {
      setFileName('Файл не выбран');
    }
  }, [value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {label && <label className="dark:text-[97989F]">{label}</label>}
      <div className="flex flex-col">
        <button
          type="button"
          onClick={handleClick}
          className="bg-[#4B6BFB] text-white py-2 px-4 rounded-md cursor-pointer"
        >
          Выберите файл
        </button>
        <span className="text-[14px] text-[#555] dark:text-[#97989F]">
          {fileName}
        </span>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        onBlur={onBlur}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default CustomFileInput;
