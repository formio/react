
var React = require('react');
var valueMixin = require('./mixins/valueMixin.jsx');
var multiMixin = require('./mixins/multiMixin.jsx');

module.exports = React.createClass({
    displayName: 'SelectBox',
    mixins: [valueMixin, multiMixin],
    componentWillMount: function() {
        this.state.value = {};
        //To update the state with false value we need set all values to the false by default. We can bypass settingup false values, as it is handled by server side.
        //But settingup false values  also help to insert all element in right order to the array (i.e. firstSelcetBox ... lastSelcetBox).
        for (var i = 0; i < this.props.component.values.length; i++) {
            this.state.value[this.props.component.values[i].value] = false;
        }
        this.props.onChange(this);
    },
    onChangeCheckbox: function(e) {
        var valueOfSelectedItem =  e.currentTarget.getAttribute('data-selectedItem');
        var value = this.state.value;
        value[valueOfSelectedItem] = e.currentTarget.checked;
        this.setState({
            value: value
        });
        this.props.onChange(this);
    },
    getSingleElement: function(value, index) {
        index = index || 0;
        var required = (this.props.component.validate.required ? 'field-required' : '');
        return (
            <div className="selectbox">
                {this.props.component.values.map(function(value,index) {
                    return (
                        <div className="checkbox" key = {index}>
                            <label className={required}>
                                <input
                                    type="checkbox"
                                    key={this.props.component.key}
                                    data-index={index}
                                    data-selectedItem={value.value}
                                    name={this.props.name}
                                    checked={this.state.value[value.value] || ''}
                                    onChange={this.onChangeCheckbox}
                                />{value.label}
                            </label>
                        </div>
                    );
                }.bind(this))}
            </div>
        );
    }
});
