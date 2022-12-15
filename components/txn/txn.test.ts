import { describe, expect, test } from '@jest/globals';
import { renderTxn } from '.';

describe('render txn', () => {
  test('uncompleted posting', () => {
    const result = renderTxn({
      date: '2021-01-01',
      completed: true,
      narration: 'narration',
      payee: 'payee',
      postings: []
    })
    expect(result).toBe(`2021-01-01 * "payee" "narration"\n\n`)
  });
  test('uncompleted posting with comment', () => {
    const result = renderTxn({
      date: '2021-01-01',
      completed: true,
      narration: 'narration',
      payee: 'payee',
      postings: [],
      comments: ['comment'],
    })
    expect(result).toBe(`; comment
2021-01-01 * "payee" "narration"

`)
  });
  test('single posting', () => {
    const result = renderTxn({
      date: '2021-01-01',
      completed: false,
      narration: 'narration',
      payee: 'payee',
      postings: [{
        account: 'Asset:Checking',
        amount: '10',
        commodity: 'CNY',
      }],
    });
    expect(result).toBe(`2021-01-01 ! "payee" "narration"
  Asset:Checking 10 CNY

`);
  })
  test('multiple postings', () => {
    const result = renderTxn({
      date: '2021-01-01',
      completed: true,
      narration: 'narration',
      payee: 'payee',
      postings: [{
        account: 'Asset:Checking',
        amount: '-10',
        commodity: 'CNY',
      }, {
        account: 'Expense:Food',
        amount: '2',
        commodity: 'CNY',
      }, {
        account: 'Expense:Fruit',
      }],
    });
    expect(result).toBe(`2021-01-01 * "payee" "narration"
  Asset:Checking -10 CNY
  Expense:Food 2 CNY
  Expense:Fruit

`);
  })
  test('posting with other totalCostCommodity', () => {
    const result = renderTxn({
      date: '2021-01-01',
      completed: false,
      narration: 'narration',
      payee: 'payee',
      postings: [{
        account: 'Asset:Checking',
        amount: '10',
        commodity: 'HKD',
        totalCost: '8',
        totalCostCommodity: 'CNY',
      }],
    });
    expect(result).toBe(`2021-01-01 ! "payee" "narration"
  Asset:Checking 10 HKD @@ 8 CNY

`);
  })
});
