# Change Log

All notable changes to this project will be documented in this file

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased: 5.4.0-rc.1]

### Changed

-   FIO-7733: type form component
-   FIO-7563 added events to FormEdit Component
-   Bump follow-redirects from 1.15.2 to 1.15.5
-   Bump @babel/traverse from 7.21.5 to 7.23.2
-   FIO-7489 formio js 5/bootstrap 5 updates to react library
-   pass down a ref callback to custom component instead of relying on the return value of ReactDOM.render

## 5.3.0

### Changed

-   Official Release

## 5.3.0-rc.3

### Added

-   FIO-6493: added react wrapper for reports
-   FIO-7139: Replaced defaultProps with JS default values
-   FIO-7315: Added missed form options properties to the PropTypes
-   Upgrade @babel/core@7.23.0, chai@4.3.9, formiojs@4.17.1, typescript@5.2.2, core-js@3.32.2

## 5.3.0-rc.2

### Fixed

-   FIO-4301/4302: Fixes an issue where for is being set to the old formioInstance after recreating it

### Changed

-   Bump tough-cookie from 4.1.2 to 4.1.3
-   Bump semver from 5.7.1 to 5.7.2
-   Bump word-wrap from 1.2.3 to 1.2.4
-   Upgrade @babel/core@7.22.9, babel-loader@9.1.3, eslint-plugin-import@2.28.0, eslint-plugin-react@7.33.0, formiojs@4.15.1, jsdom@22.1.0, sinon@15.2.0, typescript@5.1.6, webpack@5.88.2, core-js@3.32.0
-   Upgrade formiojs peerDependency to formiojs@4.15.1

## 5.3.0-rc.1

### Changed

-   Changed formio.js to formiojs@4.15.0-rc.23
-   Upgrade babel-loader@9.1.2, escope@4.0.0, eslint@8.41.0, eslint-plugin-mocha@10.1.0, jsdom@22.0.0, mocha@10.2.0, react-test-renderer@18.2.0, sinon@15.1.0, typescript@5.0.4

### Fixed

-   FIO-6440: Upgrades dependencies and fixes warnings
-   add methode before on submit so it can be generated in typing
-   Updated `FormEdit` proptypes to match the props used within the component. Adds `saveForm` function and `saveText` string

## 5.2.4-rc.3

### Fixed

-   FIO-6440: Upgrades dependencies and fixes warnings

## 5.2.4-rc.2

### Fixed

-   FIO-4570: Fix issue with form redrawing when passing form object as props
-   updated props in formBuilder

## 5.2.2

### Fixed

-   fixed propTypes that cause error in console

## 5.2.1

### Fixed

-   Fixed an issue where user state is cleared before the user is logged out
-   added access to the form schema in change event in react form builder

## 5.2.0

### Changed

-   Update to work with latest React and also fixed imports from formiojs for build size.

## 5.1.1

### Fixed

-   Add formio dependency to submission hook

## 5.1.0

### Fixed

-   Remove unnecessary check for form and components

### Changed

-   Official release

## 5.1.0-rc.1

### Fixed

-   Change the way formio being stored
-   FIO-2660: Fixes an issue where FormBuilder reacreats a formiojs instance on each update

## 5.0.0

### Fixed

-   An issue with FormsGrid.

## 5.0.0-rc.3

### Changed

-   Changed name to @formio/react.

### Fixed

-   Fixes an issue where FormBuilder stucks in an infinite loop

## 5.0.0-rc.1

### Changed

-   Upgraded many dependencies.
-   added Pagination component export
-   Added event when form is ready

## 5.0.0-alpha.1

### Changed

-   Refactored to work with latest React version.

## 4.3.0

### Changed

-   Upgrade formio.js to 4.9.0.

## 4.2.6

### Changed

-   Update dependencies for security updates.

## 4.2.5

### Fixed

-   Check validity return correct value.

## 4.2.4

### Fixed

-   Empty wizard change event.
-   Project access not setting correctly in auth state.

## 4.2.3

### Fixed

-   Change event on builder.

## 4.2.2

### Added

-   PDF Uploaded event watcher

### Fixed

-   Form reset when props change
-   onChange and onDelet not being called in builder.

## 4.2.1

### Fixed

-   getForm not calculating url correctly.

## 4.2.0

### Changed

-   Upgrade formio.js to 4.2 branch.
-   Make event management generic so it can pass through all events.

## 4.0.0

### Changed

-   Upgrade formio.js to 4.x branch to enable templating.
-   Refactor of modules and new components.

## 3.1.9

### Changed

-   FormGrid title links from a to span to remove weirdness with router.

## 3.1.8

### Changed

-   Allow override of FormEdit
-   Auth actions and reducers to make requests more efficient.

### Added

-   selectIsActive selector.

## 3.1.7

### Removed

-   console.log statements left in.

## 3.1.6

### Removed

-   Title from FormEdit

### Fixed

-   saveForm action was not saving.

### Added

-   Errors component
-   selectError selector

## 3.1.5

### Added

-   Sorting of SubmissionGrid and FormGrid

## 3.1.4

### Added

-   Pagination to SubmissionGrid and FormGrid

### Changed

-   Specify query for submissions and forms reducers and remove tag.

## 3.1.3

### Added

-   Url to reducers

### Changed

-   isFetching becomes isActive
-   FormEdit will autogenerate name and path for new forms.

### Removed

-   Options parameter to actions.

## 3.1.2

### Added

-   New reset actions for resetting state
-   FormGrid component
-   FormEdit component
-   Add action callback

## Changed

-   Refactor SubmissionGrid component
-   Refactor Grid component

## 3.1.1

### Added

-   Option to override the renderer and builder if they have custom components.

## 3.1.0

### Changed

-   Refactor module code to remove unneeded complexity

## 3.0.6

### Rerelease

## 3.0.5

### Changed

-   Update Formio verison

### Fixed

-   Event emitter cross polinating between forms.
-   Proptypes of formprovider

## 3.0.3

### Changed

-   Integration tests fixed.
-   react/react-dom dependencies updated to version 16.

## 3.0.2

### Changed

-   Formio component renamed to Form.
    > > > > > > > origin/3.x

## 3.0.1

### Added

-   url property for when using form instead of src.

## 3.0.0

### Changed

-   Change formio.js version to 3.0.0 now that it is released.

## 2.1.1

### Fixed

-   Destroy event on form builder component.

## 2.1.0

### Added

-   Form Builder component

## 2.0.4

### Fixed

-   Prop type for i18n.

## 2.0.3

### Changed

-   Upgrade core renderer from 2.10.1 to 2.20.4

## 2.0.2

### Changed

-   Rebuild for failed build.

## 2.0.1

### Fixed

-   Allow adjusting submission while form is being created

## 2.0.0

### Changed

-   Renderer now based on formio.js Core Renderer.

### Removed

-   All helper libraries.

## 1.4.2

### Changed

-   Fire edit grid open event on componentDidMount instead of componentWillMount.

## 1.4.1

### Fixed

-   HTML output of editgrid header

### Added

-   Footer for editgrid

## 1.4.0

### Added

-   Time component
-   EditGrid component

## 1.3.14

-   Fix default formatting of empty custom error validation.

## 1.3.13

### Fixed

-   Disable datagrid buttons when form is read only.
-   Don't fire change events for readOnly forms.

## 1.3.12

### Added

-   Events that fire when select lists open or close.
-   Event that fires on add/remove from datagrid.
-   Event that fires on loadMore for selects.

## 1.3.11

### Reverted

-   Reverted revert of change to datagrids delete value.

### Fixed

-   Calculated Select values could return something other than an array which caused an error.

## 1.3.10

### Reverted

-   Reverted change to setting values that attempted to fix deleting rows in datagrids issue that had a lot of side effects.

### 1.3.9

### Fixed

-   Fix MinLength calculation for datagrids.
-   Fixed error about setState in select component.
-   Scenario where updating a form doesn't always set the values.

### Changed

-   Replace full lodash with individual functions.

## 1.3.8

### Fixed

-   Datagrids with select components dependent on external data weren't updating when the data updated.

## 1.3.7

### Changed

-   Datagrid headers won't render if there are no labels.

## 1.3.6

### Fixed

-   Deleting rows in datagrids didn't clear components properly.

## 1.3.5

### Fixed

-   Fix performance of datagrids with large data.

## 1.3.4

### Added

-   Onchange event will fire for input fields after 500ms of no typing instead of only on blur.

## 1.3.3

### Added

-   Expose mixins as exports to ease creation of custom components.

## 1.3.2

Changed

-   Text inputs will fire change events on blur now instead of on change. Change events were too slow in redux.

## 1.3.1

### Fixed

-   Fixed tests dealing with input mask change and missing onChange events.

### Removed

-   Removing tests that don't work with current libraries.

## 1.3.0

### Changed

-   Swapped react-input-mask for react-text-mask for input masks.
-   Improved performance of input masks.
