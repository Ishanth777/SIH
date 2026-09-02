import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3001';

export class MobileApiService {
  private static async getHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  static async updateLocation(workerId: string, latitude: number, longitude: number): Promise<boolean> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/workers/${workerId}/location`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ latitude, longitude }),
    });
    return response.ok;
  }

  static async updateAvailability(workerId: string, isAvailable: boolean): Promise<boolean> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/workers/${workerId}/availability`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ isAvailable }),
    });
    return response.ok;
  }
}
