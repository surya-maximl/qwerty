import { useState, ChangeEvent } from 'react';
import { Props as  SearchPropsType} from '../SearchBox/SearchBoxProps.type';
import { Props as WidgetManagerPropsType } from './widgetManager.type'
import { DraggableBox } from '../DraggableBox/dragglebox.component';
import Fuse from 'fuse.js';
import { isEmpty } from 'lodash';
import { SearchBox } from '../SearchBox/SearchBox.component';
import { capitalizeEveryWord } from '../../utils/editorUtils';

export const WidgetManager: React.FC<WidgetManagerPropsType> = function WidgetManager({componentTypes}) {
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

  function renderList(header: string, items) {
    if (isEmpty(items)) return null;
    return (
      <div className='my-4'>
        <h1 className='text-xs text-slate-600 font-semibold mb-1'>{capitalizeEveryWord(header)}</h1>
        <div className='flex flex-wrap gap-6'>
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
    <div className='border-[1px] border-solid border-t-0 border-borderColor w-full py-6 px-4'>
      <p className='font-semibold text-lg'>Components</p>
      <div>
        <SearchBox
          {...SearchProps}
        />
      </div>
      <div className='p-2'>{segregateSections()}</div>
    </div>
  );
};
