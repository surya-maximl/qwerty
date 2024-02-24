import { ChangeEvent, useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Flex, Input } from 'antd';

import useDebounce from '../../../../shared/hooks/useDebounce';
import useMounted from '../../../../shared/hooks/useMount';
import { Props } from './SearchBoxProps.type';

export const SearchBox: React.FC<Props> = ({
  onSubmit,
  debounceDelay = 300,
  placeholder = 'Search',
  customClass = '',
  callBack,
  onClearCallback,
  autoFocus = false,
  initialValue = ''
}) => {
  const [searchText, setSearchText] = useState('');
  const debouncedSearchTerm = useDebounce(searchText, debounceDelay);
  const [isFocused, setFocussed] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    callBack?.(e);
  };

  const clearSearchText = () => {
    setSearchText('');
    onClearCallback?.();
  };

  const mounted = useMounted();

  useEffect(() => {
    if (mounted) {
      onSubmit?.(debouncedSearchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, onSubmit]);

  useEffect(() => {
    initialValue !== undefined && setSearchText(initialValue);
  }, [initialValue]);

  return (
    <div className={`search-box-wrapper ${customClass}`}>
      <Flex className="input-icon items-center" gap="small">
        {!isFocused && (
          <span className="input-icon-addon">
            <SearchOutlined />
          </span>
        )}
        <Input
          className=""
          type="text"
          value={searchText}
          onChange={handleChange}
          placeholder={placeholder}
          onFocus={() => setFocussed(true)}
          onBlur={() => setFocussed(false)}
          autoFocus={autoFocus}
        />
        {searchText.length > 0 ? (
          <span className="input-icon-addon end" onMouseDown={clearSearchText}>
            <div>
              <SearchOutlined />
            </div>
          </span>
        ) : (
          ''
        )}
      </Flex>
    </div>
  );
};
