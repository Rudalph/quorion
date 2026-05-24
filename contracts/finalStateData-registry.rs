use anchor_lang::prelude::*;

declare_id!("GswtVwhtr88FwZnv84S1uK7HJ1DBNamqczKRS7juEYWt");

#[program]
pub mod final_state_registry {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let registry = &mut ctx.accounts.registry;
        registry.authority = ctx.accounts.authority.key();
        registry.items = Vec::new();
        registry.updated_at = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn save_final_state(
        ctx: Context<SaveFinalState>,
        items: Vec<FinalStateItem>,
    ) -> Result<()> {
        let registry = &mut ctx.accounts.registry;

        require!(
            ctx.accounts.authority.key() == registry.authority,
            CustomError::Unauthorized
        );

        registry.items = items;
        registry.updated_at = Clock::get()?.unix_timestamp;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + FinalStateRegistry::MAX_SIZE,
        seeds = [b"final-state-registry"],
        bump
    )]
    pub registry: Account<'info, FinalStateRegistry>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SaveFinalState<'info> {
    #[account(
        mut,
        seeds = [b"final-state-registry"],
        bump
    )]
    pub registry: Account<'info, FinalStateRegistry>,

    pub authority: Signer<'info>,
}

#[account]
pub struct FinalStateRegistry {
    pub authority: Pubkey,
    pub updated_at: i64,
    pub items: Vec<FinalStateItem>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct FinalStateItem {
    pub id: String,
    pub name: String,
    pub risk_score: u8,
    pub is_deprecated: bool,
    pub is_default: bool,
}

impl FinalStateRegistry {
    pub const MAX_ITEMS: usize = 20;
    pub const MAX_STRING_LENGTH: usize = 64;

    pub const ITEM_SIZE: usize = 4 + Self::MAX_STRING_LENGTH + // id String
        4 + Self::MAX_STRING_LENGTH + // name String
        1 +                         // risk_score
        1 +                         // is_deprecated
        1; // is_default

    pub const MAX_SIZE: usize = 32 +                        // authority
        8 +                         // updated_at
        4 +                         // Vec length
        Self::MAX_ITEMS * Self::ITEM_SIZE;
}

#[error_code]
pub enum CustomError {
    #[msg("You are not authorized to update this registry")]
    Unauthorized,
}
