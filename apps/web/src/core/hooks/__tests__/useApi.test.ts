import { renderHook, waitFor, act } from "@testing-library/react";
import { vi } from "vitest";
import { useApi } from "../useApi";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useApi", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should handle successful API call", async () => {
    const mockData = { id: 1, name: "Test" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockData }),
    });

    const apiFunction = vi.fn().mockResolvedValue({
      success: true,
      data: mockData,
    });

    const { result } = renderHook(() => useApi(apiFunction));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    await act(async () => {
      const response = await result.current.execute();
      expect(response).toEqual(mockData);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBe(null);
    });

    expect(apiFunction).toHaveBeenCalledTimes(1);
  });

  it("should handle API call with success: false", async () => {
    const apiFunction = vi.fn().mockResolvedValue({
      success: false,
      message: "API Error",
    });

    const { result } = renderHook(() => useApi(apiFunction));

    await act(async () => {
      const response = await result.current.execute();
      expect(response).toBe(null);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe("API Error");
    });
  });

  it("should handle API call error", async () => {
    const errorMessage = "Network error";
    const apiFunction = vi.fn().mockRejectedValue({
      message: errorMessage,
      errors: [{ field: "name", message: "Required" }],
    });

    const { result } = renderHook(() => useApi(apiFunction));

    await act(async () => {
      const response = await result.current.execute();
      expect(response).toBe(null);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.apiError).toEqual({
        success: false,
        message: errorMessage,
        errors: [{ field: "name", message: "Required" }],
      });
    });
  });

  it("should call onSuccess callback", async () => {
    const mockData = { id: 1, name: "Test" };
    const onSuccess = vi.fn();

    const apiFunction = vi.fn().mockResolvedValue({
      success: true,
      data: mockData,
    });

    const { result } = renderHook(() => useApi(apiFunction, { onSuccess }));

    await act(async () => {
      await result.current.execute();
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(mockData);
    });
  });

  it("should call onError callback", async () => {
    const errorMessage = "API Error";
    const onError = vi.fn();

    const apiFunction = vi.fn().mockRejectedValue({
      message: errorMessage,
    });

    const { result } = renderHook(() => useApi(apiFunction, { onError }));

    await act(async () => {
      await result.current.execute();
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  it("should reset state", async () => {
    const mockData = { id: 1, name: "Test" };
    const apiFunction = vi.fn().mockResolvedValue({
      success: true,
      data: mockData,
    });

    const { result } = renderHook(() => useApi(apiFunction));

    await act(async () => {
      await result.current.execute();
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.apiError).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it("should set data manually", () => {
    const mockData = { id: 1, name: "Test" };
    const apiFunction = vi.fn();

    const { result } = renderHook(() => useApi(apiFunction));

    act(() => {
      result.current.setData(mockData);
    });

    expect(result.current.data).toEqual(mockData);
  });
});
