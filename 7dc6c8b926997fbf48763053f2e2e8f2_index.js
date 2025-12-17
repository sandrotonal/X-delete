#!/usr/bin/env node

const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

class TwitterCleanup {
    constructor() {
        this.client = new TwitterApi({
            appKey: process.env.API_KEY,
            appSecret: process.env.API_SECRET,
            accessToken: process.env.ACCESS_TOKEN,
            accessSecret: process.env.ACCESS_SECRET,
        });
        
        this.clientV2 = this.client.v2;
        this.userId = null;
        this.deletedCount = 0;
        this.totalCount = 0;
        this.repliesCount = 0;
        this.filteredCount = 0;
    }

    async authenticate() {
        try {
            console.log('🔐 Twitter API bağlantısı kuruluyor...');
            const me = await this.clientV2.me();
            this.userId = me.data.id;
            console.log(`✅ Bağlantı başarılı! Kullanıcı: @${me.data.username}`);
            return true;
        } catch (error) {
            console.error('❌ Kimlik doğrulama hatası:', error.message);
            return false;
        }
    }

    async getAllTweets(options = {}) {
        const tweets = [];
        let paginationToken = null;
        let hasNextPage = true;
        
        console.log('📊 Tweetler çekiliyor...');
        
        while (hasNextPage) {
            try {
                const params = {
                    max_results: 100,
                    'tweet.fields': 'created_at,in_reply_to_user_id,author_id',
                    ...(paginationToken && { pagination_token: paginationToken })
                };

                const response = await this.clientV2.userTimeline(this.userId, params);
                
                const newTweets = response.data || [];
                tweets.push(...newTweets);
                
                console.log(`📝 ${tweets.length} tweet çekildi...`);
                
                // Pagination kontrolü
                if (response.meta && response.meta.next_token) {
                    paginationToken = response.meta.next_token;
                    hasNextPage = true;
                } else {
                    hasNextPage = false;
                }
                
                // Rate limit koruması için küçük bekleme
                await this.sleep(100);
                
            } catch (error) {
                if (error.code === 429) {
                    console.log('⏳ Rate limit aşıldı, 60 saniye bekleniyor...');
                    await this.sleep(60000);
                } else {
                    console.error('❌ Tweet çekme hatası:', error.message);
                    break;
                }
            }
        }
        
        return tweets;
    }

    filterTweets(tweets, options) {
        const filtered = [];
        
        for (const tweet of tweets) {
            const isReply = tweet.in_reply_to_user_id !== null;
            
            // Reply filtresi
            if (options.repliesOnly && !isReply) {
                continue;
            }
            
            // Tarih filtresi
            if (options.beforeDate) {
                const tweetDate = new Date(tweet.created_at);
                const beforeDate = new Date(options.beforeDate);
                
                if (tweetDate >= beforeDate) {
                    continue;
                }
            }
            
            filtered.push(tweet);
        }
        
        return filtered;
    }

    async deleteTweets(tweets, dryRun = false) {
        if (dryRun) {
            console.log('\n🔍 DRY RUN MODU - Silme yapılmayacak, sadece analiz\n');
            this.showDryRunReport(tweets);
            return;
        }

        console.log(`\n🗑️ ${tweets.length} tweet silinecek...\n`);
        
        for (let i = 0; i < tweets.length; i++) {
            const tweet = tweets[i];
            
            try {
                await this.client.v2.deleteTweet(tweet.id);
                this.deletedCount++;
                
                console.log(`✅ Silindi [${this.deletedCount}/${tweets.length}]: ${tweet.id} - ${tweet.created_at.substring(0, 10)}`);
                
                // Random delay (2000-4000ms)
                const delay = 2000 + Math.random() * 2000;
                await this.sleep(delay);
                
            } catch (error) {
                if (error.code === 429) {
                    console.log('⏳ Rate limit aşıldı, 2 dakika bekleniyor...');
                    await this.sleep(120000);
                    i--; // Bu tweet'i tekrar dene
                } else {
                    console.error(`❌ Silinemedi [${this.deletedCount}/${tweets.length}]: ${tweet.id} - ${error.message}`);
                }
            }
        }
        
        this.showCompletionReport();
    }

    showDryRunReport(tweets) {
        const replies = tweets.filter(t => t.in_reply_to_user_id !== null);
        const normalTweets = tweets.filter(t => t.in_reply_to_user_id === null);
        
        console.log('📊 DRY RUN RAPORU:');
        console.log('='.repeat(50));
        console.log(`📝 Toplam tweet sayısı: ${tweets.length}`);
        console.log(`💬 Reply sayısı: ${replies.length}`);
        console.log(`📢 Normal tweet sayısı: ${normalTweets.length}`);
        console.log(`🗑️ Silinecek tweet sayısı: ${tweets.length}`);
        
        if (replies.length > 0) {
            console.log('\n💬 İlk 5 reply:');
            replies.slice(0, 5).forEach(tweet => {
                console.log(`  - ${tweet.id}: ${tweet.created_at}`);
            });
        }
        
        console.log('\n⚠️  Gerçek silme için --dry-run parametresini kaldırın');
    }

    showCompletionReport() {
        console.log('\n📊 İŞLEM TAMAMLANDI:');
        console.log('='.repeat(50));
        console.log(`✅ Silinen tweet sayısı: ${this.deletedCount}`);
        console.log(`⏱️  Toplam süre: Yaklaşık ${Math.round(this.deletedCount * 3 / 60)} dakika`);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    parseArguments() {
        const args = process.argv.slice(2);
        const options = {
            dryRun: false,
            repliesOnly: false,
            beforeDate: null
        };

        for (const arg of args) {
            if (arg === '--dry-run') {
                options.dryRun = true;
            } else if (arg === '--replies-only') {
                options.repliesOnly = true;
            } else if (arg.startsWith('--before=')) {
                options.beforeDate = arg.split('=')[1];
            }
        }

        return options;
    }

    async run() {
        console.log('🧹 Twitter Tweet Temizleme Aracı');
        console.log('='.repeat(40));
        
        // Argümanları parse et
        const options = this.parseArguments();
        
        // Kimlik doğrula
        const authSuccess = await this.authenticate();
        if (!authSuccess) {
            process.exit(1);
        }

        // Tweetleri çek
        const allTweets = await this.getAllTweets();
        console.log(`📊 Toplam ${allTweets.length} tweet bulundu`);
        
        // Tweetleri filtrele
        const filteredTweets = this.filterTweets(allTweets, options);
        console.log(`🎯 Filtreler sonrası ${filteredTweets.length} tweet hedeflendi`);

        // Tweetleri sil
        await this.deleteTweets(filteredTweets, options.dryRun);
    }
}

// Script'i çalıştır
if (require.main === module) {
    const cleanup = new TwitterCleanup();
    cleanup.run().catch(error => {
        console.error('💥 Beklenmeyen hata:', error);
        process.exit(1);
    });
}

module.exports = TwitterCleanup;