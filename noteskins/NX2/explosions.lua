--[[TO-DO] -------------------------------------------------------------------------------------------------

--]] -------------------------------------------------------------------------------------------------------

--[[UPDATES] -----------------------------------------------------------------------------------------------
	CM20200503:	At the step preview of the luizsan theme it shows the black border even having the additive
				blend enabled. That's why I left StepFX not visible at Init.
				Pending make mine explosions player independent...
	CM20200607:	Changed paths to load from HD folder.
				Added Taps and TapNotes for Routine Explosion.
--]] -------------------------------------------------------------------------------------------------------

local score= {
	TapNoteScore_W1= true,
	TapNoteScore_W2= true,
	TapNoteScore_W3= true,
	TapNoteScore_W4= true,
	TapNoteScore_W5= true,
	HoldNoteScore_Held= true,
}

local skin_name = Var("skin_name");
return function(button_list, stepstype, skin_parameters)
	local ret= {}
	local tap_expl= {
		DownLeftStepNote= 0,
		UpLeft= 1,
		Center= 2,
		UpRight= 3,
		DownRight= 4
	}
	for i, button in ipairs(button_list) do
		local tap_tex = NOTESKIN:get_path(skin_name, "HD/Tap");
		local tapn_tex = NOTESKIN:get_path(skin_name, "HD/" .. button.." TapNote");

		if GAMEMAN:stepstype_is_multiplayer(stepstype) then
			tap_tex = NOTESKIN:get_path(skin_name, "HD/Routine/Tap");
			tapn_tex = NOTESKIN:get_path(skin_name, "HD/Routine/" .. button.." TapNote");
		end
		
		local column_frame= Def.ActorFrame{
			InitCommand= function(self)
				self:draworder(notefield_draw_order.explosion):basezoom(1/1.5)
			end,
			Def.ActorFrame{
				InitCommand= function(self)
						self:visible(true):playcommand("expl"):sleep(0):queuecommand("hide")
				end,
				ColumnJudgmentCommand= function(self, param)
					if score[param.tap_note_score or param.hold_note_score] == true then
						self:visible(true):playcommand("expl"):sleep(0):queuecommand("hide")
					end
				end,
				
				explCommand= function(self)
					self:stoptweening():zoom(1):diffusealpha(1):linear(0.4):zoom(1.2):diffusealpha(0)
				end,
				hideCommand= function(self)
					self:stoptweening():visible(false)
				end,
				
				Def.Sprite{
					Texture= tap_tex,
					InitCommand= function(self)
						self:addy(-1):animate(false):setstate(tap_expl[button]):blend("BlendMode_Add")
					end,
				},
				
				Def.Sprite{
					Texture= tapn_tex,
					InitCommand= function(self)
						self:visible(true):blend("BlendMode_Add"):playcommand("f0")
					end,
					
					f0Command= function (self) self:stoptweening():setstate(0):sleep(0.05):queuecommand("f1") end,
					f1Command= function (self) self:setstate(1):sleep(0.05):queuecommand("f2") end,
					f2Command= function (self) self:setstate(2):sleep(0.05):queuecommand("f3") end,
					f3Command= function (self) self:setstate(3):sleep(0.05):queuecommand("f4") end,
					f4Command= function (self) self:setstate(4):sleep(0.05):queuecommand("f5") end,
					f5Command= function (self) self:setstate(5):sleep(0.05):queuecommand("f0") end,
				},
			},
			
			Def.Sprite{
				Texture= NOTESKIN:get_path(skin_name, "HD/StepFX"),
				InitCommand= function(self)
					self:visible(false):blend("BlendMode_Add"):animate(false):queuecommand("f0")
				end,
				
				ColumnJudgmentCommand= function(self, param)
					if score[param.tap_note_score or param.hold_note_score] == true then
						self:visible(true):playcommand("f0")
					end
				end,
				
				f0Command= function (self) self:stoptweening():setstate(0):sleep(0.05):queuecommand("f1") end,
				f1Command= function (self) self:setstate(1):sleep(0.05):queuecommand("f2") end,
				f2Command= function (self) self:setstate(2):sleep(0.05):queuecommand("f3") end,
				f3Command= function (self) self:setstate(3):sleep(0.05):queuecommand("f4") end,
				f4Command= function (self) self:setstate(4):sleep(0.05):queuecommand("hide") end,
				
				hideCommand= function(self)
					self:stoptweening():visible(false)
				end,
			},
			Def.Quad{
				InitCommand= function(self)
					-- if GAMESTATE:IsSideJoined(PLAYER_1) then
						-- self:x(21):y(SCREEN_CENTER_Y):scaletoclipped(SCREEN_WIDTH*0.5,SCREEN_HEIGHT*2)
					-- elseif GAMESTATE:IsSideJoined(PLAYER_2) then
						-- self:x(640):y(SCREEN_CENTER_Y):scaletoclipped(SCREEN_WIDTH*0.5,SCREEN_HEIGHT*2)
					-- elseif player == 3 then
						self:visible(false):x(SCREEN_CENTER_X):y(SCREEN_CENTER_Y):scaletoclipped(SCREEN_WIDTH*4,SCREEN_HEIGHT*4)
					-- end
				end,
				ColumnJudgmentCommand= function(self, param)
					if param.tap_note_score == "TapNoteScore_HitMine" then
						self:visible(true):finishtweening()
							:diffusealpha(1):accelerate(0.6):diffusealpha(0)
							:sleep(0):queuecommand("hide")
					end
				end,
				hideCommand= function(self)
					self:visible(false)
				end,
			},
		}
		ret[i]= column_frame
	end
	return ret
end
