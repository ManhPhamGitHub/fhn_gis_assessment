import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhitelistDomain } from '../db/entities/whitelist.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const WHITELIST_CACHE_KEY = 'whitelist_domains';

@Injectable()
export class WhitelistService {
  private readonly logger = new Logger(WhitelistService.name);

  constructor(
    @Inject('CACHE_MANAGER') private readonly cacheManager: any,
    @InjectRepository(WhitelistDomain)
    private readonly whitelistRepo: Repository<WhitelistDomain>,
  ) {}

  /**
   * Load whitelist domains from environment variable WHITELIST_DOMAINS (comma separated)
   * or return cached value if present.
   */
  async getDomains(): Promise<string[]> {
    const cached = await this.cacheManager.get(WHITELIST_CACHE_KEY);
    if (cached && Array.isArray(cached)) return cached;

    // cache miss -> read from DB
    try {
      const rows = await this.whitelistRepo.find();
      if (rows && rows.length > 0) {
        const domains = new Set(rows.map((r) => r.domain.toLowerCase()));
        await this.cacheManager.set(WHITELIST_CACHE_KEY, Array.from(domains), {
          ttl: 60 * 60,
        });
        return Array.from(domains);
      }
    } catch (err) {
      this.logger.warn(
        'Failed to read whitelist from DB, falling back to env var',
      );
    }
  }

  async isAllowed(email: string): Promise<boolean> {
    if (!email || typeof email !== 'string') return false;
    const at = email.lastIndexOf('@');
    if (at === -1) return false;
    const domain = email.slice(at + 1).toLowerCase();
    const domains = await this.getDomains();
    return domains.includes(domain);
  }
}
