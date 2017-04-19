# Change Log 
All notable changes to this project will be documented in this file

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
## 1.3.7
### Changed
 - Datagrid headers won't render if there are no labels.

## 1.3.6
### Fixed
 - Deleting rows in datagrids didn't clear components properly.

## 1.3.5
### Fixed
 - Fix performance of datagrids with large data.

## 1.3.4
### Added
 - Onchange event will fire for input fields after 500ms of no typing instead of only on blur.

## 1.3.3
### Added
 - Expose mixins as exports to ease creation of custom components.

## 1.3.2
Changed
 - Text inputs will fire change events on blur now instead of on change. Change events were too slow in redux.

## 1.3.1
### Fixed
 - Fixed tests dealing with input mask change and missing onChange events. 

### Removed
 - Removing tests that don't work with current libraries.

## 1.3.0
### Changed
 - Swapped react-input-mask for react-text-mask for input masks.
 - Improved performance of input masks.
