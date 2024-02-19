import { useState, ChangeEvent, useEffect } from 'react';
import { DraggableBox } from '../DraggableBox/dragglebox.component';
import Fuse from 'fuse.js';
import { isEmpty } from 'lodash';
import { SearchBox } from '../SearchBox/SearchBox.component';

type Props = {
  componentTypes: any
}

type SearchPropsType = {
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

export const WidgetManager: React.FC<Props> = function WidgetManager({componentTypes}) {
  const [filteredComponents, setFilteredComponents] = useState(componentTypes);
  const [searchQuery, setSearchQuery] = useState('');

  function handleSearchQueryChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;

    setSearchQuery(value);
    filterComponents(value);
  }

  function filterComponents(value: string) {
    if (value !== '') {
      const fuse = new Fuse(componentTypes, { keys: ['component'] });
      const results = fuse.search(value);
      setFilteredComponents(results.map((result) => result.item));
    } else {
      setFilteredComponents(componentTypes);
    }
  }

  function renderList(header, items) {
    if (isEmpty(items)) return null;
    return (
      <div>
        <span>{header}</span>
        <div>
          {items.map((component, i) => <DraggableBox key={i} index={i} component={component}/>)}
        </div>
      </div>
    );
  }

  function segregateSections() {
    if (filteredComponents.length === 0) {
      return (
        <div>
          <p>No results found</p>
          <p>
              Try adjusting your search or filter to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setFilteredComponents(componentTypes);
              setSearchQuery('');
            }}
          >
            clear query
          </button>
        </div>
      );
    }
    const commonSection = { title: 'commonly used', items: [] };
    const layoutsSection = { title: 'layouts', items: [] };
    const formSection = { title: 'forms', items: [] };
    const integrationSection = { title: 'integrations', items: [] };
    const otherSection = { title: 'others', items: [] };
    const allWidgets: Array<string> = [];

    const commonItems = ['Table', 'Chart', 'Button', 'Text', 'Datepicker'];
    const formItems = [
      'Form',
      'TextInput',
      'NumberInput',
      'PasswordInput',
      'Textarea',
      'ToggleSwitch',
      'Dropdown',
      'Multiselect',
      'RichTextEditor',
      'Checkbox',
      'Radio-button',
      'Datepicker',
      'DateRangePicker',
      'FilePicker',
      'StarRating',
    ];
    const integrationItems = ['Map'];
    const layoutItems = ['Container', 'Listview', 'Tabs', 'Modal'];

    filteredComponents.forEach((f) => {
      if (searchQuery) allWidgets.push(f);
      if (commonItems.includes(f.name)) commonSection.items.push(f);
      if (formItems.includes(f.name)) formSection.items.push(f);
      else if (integrationItems.includes(f.name)) integrationSection.items.push(f);
      else if (layoutItems.includes(f.name)) layoutsSection.items.push(f);
      else otherSection.items.push(f);
    });

    if (allWidgets.length > 0) {
      return <>{renderList(undefined, allWidgets)}</>;
    } else {
      return (
        <>
          {renderList(commonSection.title, commonSection.items)}
          {renderList(layoutsSection.title, layoutsSection.items)}
          {renderList(formSection.title, formSection.items)}
          {renderList(otherSection.title, otherSection.items)}
          {renderList(integrationSection.title, integrationSection.items)}
        </>
      );
    }
    
  }

  const SearchProps: SearchPropsType = {
    initialValue: '',
    callBack: (e: ChangeEvent<HTMLInputElement>) => handleSearchQueryChange(e),
    onClearCallback: () => {
      setSearchQuery('');
      filterComponents('');
    },
    placeholder: 'Search widgets',
    showClearButton: false,
    width: 266
  }

  return (
    <div>
      <p>Components</p>
      <div>
        <SearchBox
          {...SearchProps}
        />
      </div>
      <div >{segregateSections()}</div>
    </div>
  );
};
