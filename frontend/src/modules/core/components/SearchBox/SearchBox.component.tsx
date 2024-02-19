import { useState, useEffect, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import useDebounce from "../../../shared/hooks/useDebounce";
import useMounted from "../../../shared/hooks/useMount";
import { SearchOutlined } from '@ant-design/icons';

type Props = {
  width?: number,
  onSubmit?: any,
  className?: string
  debounceDelay?: number,
  darkMode?: boolean,
  placeholder?: string,
  customClass?: string,
  callBack?: (e: ChangeEvent<HTMLInputElement>) => void,
  onClearCallback?: () => void,
  autoFocus?: boolean,
  showClearButton?: boolean,
  initialValue?: string,
}

export const SearchBox: React.FC<Props> = (
  (
    {
      width = 200,
      onSubmit,
      className,
      debounceDelay = 300,
      darkMode = false,
      placeholder = 'Search',
      customClass = '',
      callBack,
      onClearCallback,
      autoFocus = false,
      showClearButton,
      initialValue = '',
    }
  ) => {
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
        <div className="input-icon">
          {!isFocused && (
            <span className="input-icon-addon">
              <SearchOutlined/>
            </span>
          )}
          <input
            style={{ width }}
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
              <SearchOutlined/>
              </div>
            </span>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
);
