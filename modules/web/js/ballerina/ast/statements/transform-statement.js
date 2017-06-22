/**
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import _ from 'lodash';
import Statement from './statement';

/**
 * Class to represent an Transform statement.
 */
class TransformStatement extends Statement {
    /**
     * Constructor for TransformStatement
     * @param {object} args - transform statement arguments
     * @override
     */
    constructor(args) {
        super(args);
        this.input = _.get(args, 'input', []);
        this.output = _.get(args, 'output', []);
        this.type = 'TransformStatement';
        this.whiteSpace.defaultDescriptor.regions = {
            0: '',
            1: ' ',
            2: '\n',
            3: '\n',
        };
    }

    /**
     * set input
     * @param {object} input - input to be set
     * @returns {void}
     */
    setInput(input) {
        this.input = input;
    }

    /**
     * Set output
     * @param {object} output - output to be set
     * @returns {void}
     */
    setOutput(output) {
        this.output = output;
    }

    /**
     * Get input
     * @return {Object} input
     */
    getInput() {
        return this.input;
    }

    /**
     * Get output
     * @return {Object} output
     */
    getOutput() {
        return this.output;
    }

    /**
     * initialize Transform Statement from json object
     * @param {Object} jsonNode to initialize from
     * @param {Object} jsonNode.transform_input input variable refs for transform statement
     * @param {Object} jsonNode.transform_output output variable refs for transform statement
     * @returns {void}
     */
    initFromJson(jsonNode) {
        _.each(jsonNode.transform_input, (childNode) => {
            const inputVar = this.getFactory().createFromJson(childNode);
            inputVar.initFromJson(childNode);
            this.input.push(inputVar);
        });

        _.each(jsonNode.transform_output, (childNode) => {
            const outputVar = this.getFactory().createFromJson(childNode);
            outputVar.initFromJson(childNode);
            this.output.push(outputVar);
        });

        _.each(jsonNode.children, (childNode) => {
            const child = this.getFactory().createFromJson(childNode);
            this.addChild(child);
            child.initFromJson(childNode);
        });
    }

    /**
     * Override the removeChild function
     * @param {ASTNode} child - child node
     * @param {boolean} ignoreModifiedTreeEvent - whether ignore th tree modified event
     * @param {boolean} willVisit - whether visit or not
     * @returns {void}
     */
    removeChild(child, ignoreModifiedTreeEvent, willVisit) {
        if (!_.isUndefined(willVisit) && willVisit !== true) {
            const parentModelChildren = this.children;
            for (let itr = 0; itr < parentModelChildren.length; itr++) {
                if (parentModelChildren[itr].id === child.id) {
                    parentModelChildren.splice(itr, 1);
                    break;
                }
            }
        } else {
            Object.getPrototypeOf(this.constructor.prototype).removeChild.call(this, child, ignoreModifiedTreeEvent);
        }
    }

    /**
     * Get the transform statement string
     * @return {string} transform statement string
     */
    getStatementString() {
        return 'transform';
    }
}

export default TransformStatement;
