export interface ApiInterface {
    /**
     * view in database to call
     */
    viewName: string;
    /**
     * web roles needed to edit
     * you will also be able to set permission on column
     * this is to simplify the process, save work
     */
    accessUpdate: string[];
    /**
     * web roles needed to edit
     */
    accessDelete: string[];
    /**
     * web roles needed to edit
     */
    accessInsert: string[];
    /**
     * FOR AUTO GENERATED PAGE ONLY
     * for loading related children
     * todo: do we want to load parent table/s too ?
     */
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
    /**
     * modified
     * to get updated without getting all
     */
    modified: string;
    /**
     * primary key, will use for selection during reload/delete/update
     * either 1 or many to generate key
     * important you dont use null columns here
     */
    primaryKey: string | string[];
    /**
     * columns we can edit
     */
    updatableColumn: ApiColumn[];
}

/**
 *
 * note
 * it need to be none or one of these isCheckbox, dropDownView, dropDownValues, parentView
 * if isCheckbox, then we need checkboxChecked, checkboxUnchecked
 * if dropDownView, then we need dropDownValueColumn and dropDownLabelColumn
 * if dropDownValues, then we need atleast 2 sets [['blank', ''], ['yes', 'y']] so we can set blank
 * if parentView, then we need parentViewFrom, parentViewTo
 */
export type ApiColumn = {
    /**
     * name in view
     */
    name: string;
    /**
     * what to use in grid/labels
     */
    label: string;
    /**
     * is checkbox
     */
    update_access: string[];
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
    /**
     * simple dropdown values
     * [[label, value],[label, value]]
     */
    dropDownView: string;
    dropDownValueColumn: string;
    dropDownLabelColumn: string;
    /**
     * simple dropdown values
     * [[label, value],[label, value]]
     */
    dropDownValues: string[][];
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
    parentViewColumnsFromTo: string[][];
};
