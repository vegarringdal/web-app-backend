type ApiInterfaceBase = {
    /**
     * view in database to call
     */
    viewName: string;
    /**
     * web roles needed to edit
     * you will also be able to set permission on column
     * this is to simplify the process, save work
     */
    accessUpdate?: string[];
    /**
     * web roles needed to edit
     */
    accessDelete?: string[];
    /**
     * web roles needed to edit
     */
    accessInsert?: string[];
    /**
     * modified
     * to get updated without getting all
     */
    modified?: string;
    /**
     * columns we can edit
     */
    columns: ApiColumn[];
};

type ApiInterfaceChildView = {
    childView: string;
    /**
     * FOR AUTO GENERATED PAGE ONLY
     * child column to query
     */
    childViewTo: string;
    /**
     * FOR AUTO GENERATED PAGE ONLY
     * column to query with
     */
    childViewFrom: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type ApiInterfaceModified = {
    /**
     * primary key, will use for selection during reload/delete/update
     * either 1 or many to generate key
     * important you dont use null columns here
     */
    primaryKey: string | string[];
};

type ApiInterfaceOptions = ApiInterfaceModified | ApiInterfaceChildView;
export type ApiInterface = ApiInterfaceBase & ApiInterfaceOptions;

type ApiColumnBase = {
    /**
     * name in view
     */
    name: string;
    /**
     * what to use in grid/labels
     */
    label?: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type ApiColumnDropdownNoExtra = {
    update_access: string[];
};

type ApiColumnCheckbox = {
    /**
     * is checkbox
     */
    isCheckbox: boolean;
    /**
     * if checkbox, what value to set when checked
     */
    checkboxChecked: string;
    /**
     * if checkbox, what value to set when unchecked
     */
    checkboxUnchecked: string;
};

type ApiColumnDropdownView = {
    /**
     * simple dropdown values
     * [[label, value],[label, value]]
     */
    dropDownView: string;
    dropDownValueColumn: string;
    dropDownLabelColumn: string;
};

type ApiColumnDropdownSimple = {
    /**
     * simple dropdown values
     * [[label, value],[label, value]]
     */
    dropDownValues: string[][];
};

type ApiColumnDropdownParentView = {
    /**
     * parent_view, will bring button on for opening dialog
     */
    parentView: string;
    /**
     * parent_view column to get
     */
    parentViewFrom: string;
    /**
     * column to insert value from parent
     */
    parentViewTo: string[][];
    /**
     * parent column to update, usring par string,string
     * [[fromParentColumn, toChildColumn],[fromParentColumn, toChildColumn]]
     * useful if you have many columns from parent, also depends on view
     */
    parentViewColumnsFromTo?: string[][];
};

type ApiColumnOptions =
    | ApiColumnDropdownNoExtra
    | ApiColumnCheckbox
    | ApiColumnDropdownView
    | ApiColumnDropdownSimple
    | ApiColumnDropdownParentView;
export type ApiColumn = ApiColumnBase & ApiColumnOptions;
