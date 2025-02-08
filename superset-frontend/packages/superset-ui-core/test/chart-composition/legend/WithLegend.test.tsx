/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { WithLegend } from '@superset-ui/core';

let renderChart: jest.Mock;
let renderLegend: jest.Mock;

// Mock ResizeObserver
const mockResizeObserver = jest.fn(callback => ({
  observe: jest.fn(() => {
    // Simulate a resize with some default dimensions
    callback([
      {
        contentRect: {
          width: 100,
          height: 100,
        },
      },
    ]);
  }),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('WithLegend', () => {
  beforeAll(() => {
    // @ts-ignore
    window.ResizeObserver = mockResizeObserver;
  });

  beforeEach(() => {
    renderChart = jest.fn(() => <div className="chart" />);
    renderLegend = jest.fn(() => <div className="legend" />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sets className', () => {
    const { container } = render(
      <WithLegend
        className="test-class"
        renderChart={renderChart}
        renderLegend={renderLegend}
      />,
    );
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('renders when renderLegend is not set', async () => {
    const { container } = render(
      <WithLegend
        debounceTime={1}
        width={500}
        height={500}
        renderChart={renderChart}
      />,
    );

    await waitFor(() => {
      expect(renderChart).toHaveBeenCalledWith(
        expect.objectContaining({
          width: expect.any(Number),
          height: expect.any(Number),
        }),
      );
    });

    expect(container.querySelector('.chart')).toBeInTheDocument();
    expect(container.querySelector('.legend')).not.toBeInTheDocument();
  });

  it('renders with chart and legend', async () => {
    const { container } = render(
      <WithLegend
        debounceTime={1}
        width={500}
        height={500}
        renderChart={renderChart}
        renderLegend={renderLegend}
      />,
    );

    await waitFor(() => {
      expect(renderChart).toHaveBeenCalledWith(
        expect.objectContaining({
          width: expect.any(Number),
          height: expect.any(Number),
        }),
      );
      expect(renderLegend).toHaveBeenCalledWith(
        expect.objectContaining({
          direction: expect.any(String),
        }),
      );
    });

    expect(container.querySelector('.chart')).toBeInTheDocument();
    expect(container.querySelector('.legend')).toBeInTheDocument();
  });

  it('renders without width or height', async () => {
    const { container } = render(
      <WithLegend
        debounceTime={1}
        renderChart={renderChart}
        renderLegend={renderLegend}
      />,
    );

    await waitFor(() => {
      expect(renderChart).toHaveBeenCalledWith(
        expect.objectContaining({
          width: expect.any(Number),
          height: expect.any(Number),
        }),
      );
      expect(renderLegend).toHaveBeenCalledWith(
        expect.objectContaining({
          direction: expect.any(String),
        }),
      );
    });

    expect(container.querySelector('.chart')).toBeInTheDocument();
    expect(container.querySelector('.legend')).toBeInTheDocument();
  });

  it.each(['left', 'right', 'top', 'bottom'] as const)(
    'renders legend on the %s',
    async position => {
      const { container } = render(
        <WithLegend
          debounceTime={1}
          position={position}
          renderChart={renderChart}
          renderLegend={renderLegend}
        />,
      );

      await waitFor(() => {
        expect(renderChart).toHaveBeenCalledWith(
          expect.objectContaining({
            width: expect.any(Number),
            height: expect.any(Number),
          }),
        );
        expect(renderLegend).toHaveBeenCalledWith(
          expect.objectContaining({
            direction: expect.any(String),
          }),
        );
      });

      expect(container.querySelector('.chart')).toBeInTheDocument();
      expect(container.querySelector('.legend')).toBeInTheDocument();
    },
  );

  it('renders legend with justifyContent set', async () => {
    const { container } = render(
      <WithLegend
        debounceTime={1}
        position="right"
        legendJustifyContent="flex-start"
        renderChart={renderChart}
        renderLegend={renderLegend}
      />,
    );

    await waitFor(() => {
      expect(renderChart).toHaveBeenCalledWith(
        expect.objectContaining({
          width: expect.any(Number),
          height: expect.any(Number),
        }),
      );
      expect(renderLegend).toHaveBeenCalledWith(
        expect.objectContaining({
          direction: expect.any(String),
        }),
      );
    });

    expect(container.querySelector('.chart')).toBeInTheDocument();
    expect(container.querySelector('.legend')).toBeInTheDocument();
  });
});
