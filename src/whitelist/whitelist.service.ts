import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhitelistDomain } from '../db/entities/whitelist.entity';

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
  async getDomains(): Promise<Set<string>> {
    const cached = await this.cacheManager.get(WHITELIST_CACHE_KEY);
    if (cached && Array.isArray(cached))
      return new Set(cached.map((d) => d.toLowerCase()));

    // cache miss -> read from DB
    try {
      const rows = await this.whitelistRepo.find();
      if (rows && rows.length > 0) {
        const domains = rows.map((r) => r.domain.toLowerCase());
        await this.cacheManager.set(WHITELIST_CACHE_KEY, domains, {
          ttl: 60 * 60,
        });
        return new Set(domains);
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
    return domains.has(domain);
  }
}
