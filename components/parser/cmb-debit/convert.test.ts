import { describe, expect, test } from '@jest/globals';
import { CMBDebitRawTxn } from '.';
import { Criterion, criterionMatch, Rule, ruleMatch } from './convert';

describe('criterion match', () => {
    test('raw contains 包笼天下', () => {
        const cmbRawTxn = {
            amount: '-10.00',
            balance: '0.00',
            currency: 'CNY',
            date: '2021-01-01',
            description: '包笼天下',
            raw: '2021-01-01 CNY -10.00 0.00 包笼天下'
        } as CMBDebitRawTxn
        const criterion = {
            field: 'raw',
            operator: 'contains',
            value: '包笼天下'
        } as Criterion
        expect(criterionMatch(criterion, cmbRawTxn)).toBeTruthy()
    });

    test('description contains 包笼天下', () => {
        const cmbRawTxn = {
            amount: '-10.00',
            balance: '0.00',
            currency: 'CNY',
            date: '2021-01-01',
            description: '包笼天下',
            raw: '2021-01-01 CNY -10.00 0.00 包笼天下'
        } as CMBDebitRawTxn
        const criterion = {
            field: 'description',
            operator: 'contains',
            value: '包笼天下'
        } as Criterion
        expect(criterionMatch(criterion, cmbRawTxn)).toBeTruthy()
    });

    test('description startsWith 包笼天下', () => {
        const cmbRawTxn = {
            amount: '-10.00',
            balance: '0.00',
            currency: 'CNY',
            date: '2021-01-01',
            description: '包笼天下',
            raw: '2021-01-01 CNY -10.00 0.00 包笼天下'
        } as CMBDebitRawTxn
        const criterion = {
            field: 'description',
            operator: 'startsWith',
            value: '包笼天下'
        } as Criterion
        expect(criterionMatch(criterion, cmbRawTxn)).toBeTruthy()
    });
})

describe('rule match', () => {
    test('raw contains 包笼天下 and description equals 包笼天下', () => {
        const cmbRawTxn = {
            amount: '-10.00',
            balance: '0.00',
            currency: 'CNY',
            date: '2021-01-01',
            description: '包笼天下',
            raw: '2021-01-01 CNY -10.00 0.00 包笼天下'
        } as CMBDebitRawTxn

        const rule = {
            actions: [],
            criteria: [{
                field: 'raw',
                operator: 'contains',
                value: '包笼天下'
            }, {
                field: 'description',
                operator: 'equals',
                value: '包笼天下'
            }]
        } as Rule
        expect(ruleMatch(rule, cmbRawTxn)).toBeTruthy()
    });
    test('raw contains 包笼天下 and description notEquals 包笼天下', () => {
        const cmbRawTxn = {
            amount: '-10.00',
            balance: '0.00',
            currency: 'CNY',
            date: '2021-01-01',
            description: '包笼天下',
            raw: '2021-01-01 CNY -10.00 0.00 包笼天下'
        } as CMBDebitRawTxn

        const rule = {
            actions: [],
            criteria: [{
                field: 'raw',
                operator: 'contains',
                value: '包笼天下'
            }, {
                field: 'description',
                operator: 'notEquals',
                value: '包笼天下'
            }]
        } as Rule
        expect(ruleMatch(rule, cmbRawTxn)).toBeFalsy()
    });
    test('empty criteria', () => {
        const cmbRawTxn = {
            amount: '-10.00',
            balance: '0.00',
            currency: 'CNY',
            date: '2021-01-01',
            description: '包笼天下',
            raw: '2021-01-01 CNY -10.00 0.00 包笼天下'
        } as CMBDebitRawTxn

        const rule = {
            actions: [],
            criteria: []
        } as Rule
        expect(ruleMatch(rule, cmbRawTxn)).toBeTruthy()
    })
})
