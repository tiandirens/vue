import {
    Autocomplete,
    row,
    col,
    form,
    input,
    button,
    Message,
    menu,
    submenu,
    MenuItemGroup,
    MenuItem,
    DatePicker,
    TimePicker,
    Checkbox,
    CheckboxButton,
    CheckboxGroup,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    breadcrumb,
    breadcrumbItem,
    autocomplete,
    select,
    Image,
    option,
    upload,
    table,
    TableColumn,
    popover,
    tag,
    pagination,
    dialog,
    formItem,
    buttonGroup,
    tabs,
    tabPane
  } from 'element-ui';
  
  const element = {
    install: function (Vue) {
      Vue.use(Autocomplete);
      Vue.use(row);
      Vue.use(col);
      Vue.use(form);
      Vue.use(input);
      Vue.use(button);
      // Vue.use(Message)
      Vue.prototype.$message = Message;
      Vue.use(menu);
      Vue.use(submenu);
      Vue.use(MenuItemGroup);
      Vue.use(MenuItem);
      Vue.use(DatePicker);
      Vue.use(TimePicker);
      Vue.use(Checkbox);
      Vue.use(CheckboxButton);
      Vue.use(CheckboxGroup);
      Vue.use(Dropdown);
      Vue.use(DropdownMenu);
      Vue.use(DropdownItem);
      Vue.use(breadcrumb);
      Vue.use(breadcrumbItem);
      Vue.use(autocomplete);
      Vue.use(select);
      Vue.use(Image);
      Vue.use(option);
      Vue.use(upload);
      Vue.use(table);
      Vue.use(TableColumn);
      Vue.use(popover);
      Vue.use(tag);
      Vue.use(pagination);
      Vue.use(dialog);
      Vue.use(formItem);
      Vue.use(buttonGroup);
      Vue.use(tabs);
      Vue.use(tabPane);
    }
  };
  export default element;
  