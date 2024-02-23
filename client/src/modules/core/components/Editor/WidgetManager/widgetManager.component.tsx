import { ChangeEvent, useState } from 'react';
import { Flex, Typography } from 'antd';
import Fuse from 'fuse.js';
import { isEmpty } from 'lodash';

import { capitalizeEveryWord } from '../../../utils/editorUtils';
import { DraggableBox } from '../../DraggableBox/dragglebox.component';
import { SearchBox } from '../SearchBox/SearchBox.component';
import { Props as SearchPropsType } from '../SearchBox/SearchBoxProps.type';
import { Props as WidgetManagerPropsType } from './widgetManager.type';

const { Title } = Typography;

export const WidgetManager: React.FC<WidgetManagerPropsType> = function WidgetManager({
  componentTypes
}) {
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
      <Flex vertical gap="middle" className="">
        <h1 className="text-xs text-slate-600 font-semibold">{capitalizeEveryWord(header)}</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((component, i) => (
            <DraggableBox key={i} index={i} component={component} />
          ))}
        </div>
      </Flex>
    );
  }

  function segregateSections() {
    if (filteredComponents.length === 0) {
      return (
        <Flex vertical gap="middle">
          <p>No results found</p>
          <p>Try adjusting your search or filter to find what you're looking for.</p>
          <button
            onClick={() => {
              setFilteredComponents(componentTypes);
              setSearchQuery('');
            }}
          >
            clear query
          </button>
        </Flex>
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
      'StarRating'
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
      return (
        <Flex vertical gap="large">
          {renderList(undefined, allWidgets)}
        </Flex>
      );
    } else {
      return (
        <Flex vertical gap="large">
          {renderList(commonSection.title, commonSection.items)}
          {renderList(layoutsSection.title, layoutsSection.items)}
          {renderList(formSection.title, formSection.items)}
          {renderList(otherSection.title, otherSection.items)}
          {renderList(integrationSection.title, integrationSection.items)}
        </Flex>
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
  };

  const { Title } = Typography;

  return (
    <Flex vertical gap="small" className="w-full p-4 overflow-y-auto">
      <Title level={3} className="font-bold !text-sm tracking-tight">
        Components
      </Title>
      <SearchBox {...SearchProps} />
      <div className="p-2">{segregateSections()}</div>
    </Flex>
  );
};
