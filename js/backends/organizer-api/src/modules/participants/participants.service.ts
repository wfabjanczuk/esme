import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Participant } from './participant.entity';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ParticipantsService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get('PARTICIPANT_API_URL');
    this.apiKey = this.configService.get('PARTICIPANT_API_KEY');
  }

  // TODO: check if participant is chatting with the agency
  async findOne(id: number): Promise<Participant> {
    const url = `${this.apiUrl}/users/${id}`;

    return await axios
      .get<Participant>(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })
      .then(({ data }) => data)
      .catch((e: AxiosError) => {
        const code = e?.response?.status;
        if (code === 404) {
          throw new NotFoundException(`Participant with id ${id} not found`);
        }
        throw new InternalServerErrorException(
          `Could not fetch participant with id ${id}`,
        );
      });
  }
}
